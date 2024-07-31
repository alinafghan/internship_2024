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
    public class PostCategoriesService : IPostCategoriesService
    {
        private readonly BlogDbContext _context;

        public PostCategoriesService(BlogDbContext context) {  _context = context; }


        public async Task<IEnumerable<postCategory>> GetAllPostCategoriesAsync()
        {
            return await _context.PostCategories.ToListAsync();
        }

        public async Task<postCategory> GetPostCategoryByIdAsync(int id)
        {
            return await _context.PostCategories.FindAsync(id);
        }

        public async Task CreatePostCategoryAsync(postCategory postCategory)
        {
            _context.PostCategories.Add(postCategory);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePostCategoryAsync(postCategory postCategory)
        {
            _context.Entry(postCategory).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeletePostCategoryAsync(postCategory postCategory)
        {
            _context.PostCategories.Remove(postCategory);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DoesPostCategoryExist(int categoryId, int postId)
        {
            return await _context.PostCategories.AnyAsync(e => e.CategoryId == categoryId && e.PostId == postId);
        }
    }
}



