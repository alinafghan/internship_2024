using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Application.Interfaces;
using Domain.Models;
using Infrastructure.Persistence;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class PostService : IPostService
    {
        private readonly BlogDbContext _context;

        public PostService(BlogDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Post>> GetPostsbyEditorId(int id)
        {
            return await _context.Posts
      .Where(p => p.EditorId == id)
      .ToListAsync();
        }

        public async Task<object> GetPaginatedPostsAsync(int page, int limit)
        {

            page = Math.Max(page, 1);
            limit = Math.Max(limit, 1);

            int skip = (page - 1) * limit;


            var posts = await _context.Posts
                .OrderBy(p => p.CreatedAt)
                .Skip(skip)
                .Take(limit)
                .ToListAsync();

            // Check if there are more posts to fetch
            bool hasMore = await _context.Posts
                .Skip(skip + limit)
                .AnyAsync();

            return new
            {
                Posts = posts,
                HasMore = hasMore
            };
        }

        public async Task<Post> GetPostByIdAsync(int id)
        {
            return await _context.Posts.FindAsync(id);
        }

        public async Task CreatePostAsync(Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePostAsync(Post post)
        {
            _context.Entry(post).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeletePostAsync(Post post)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DoesPostExist(int id)
        {
            return await _context.Posts.AnyAsync(e => e.PostId == id);

        }
    }
}
