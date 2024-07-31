using Application.Interfaces;
using Domain.Models;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class SearchService : ISearchService
    {
        private readonly BlogDbContext _context;

        public SearchService(BlogDbContext context) { _context = context; }

        public async Task<IEnumerable<Post>> GetPostsByCategoryName(string categoryName)
        {
            var lowerCategoryName = categoryName.ToLower();

            var posts = await _context.PostCategories
                .Join(
                    _context.Categories,
                    pc => pc.CategoryId,
                    c => c.CategoryId,
                    (pc, c) => new { pc.PostId, c.Title }
                )
                .Join(
                    _context.Posts,
                    pc => pc.PostId,
                    p => p.PostId,
                    (pc, p) => new { p, cTitle = pc.Title }
                )
                .Where(pc => EF.Functions.Like(pc.cTitle.ToLower(), $"%{lowerCategoryName}%"))
                .Select(pc => pc.p) // Select the full post object
                .Distinct()
                .ToListAsync();

            return posts;
        }
    }
}
