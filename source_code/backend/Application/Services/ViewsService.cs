using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Application.Interfaces;

namespace Application.Services
{
    public class ViewsService : IViewsService
    {
        private readonly BlogDbContext _context;

        public ViewsService(BlogDbContext context) { _context = context; }

        public async Task<IEnumerable<View>> GetAllViewsAsync()
        {
            return await _context.Views.ToListAsync();
        }

        public async Task<View> GetViewByIdAsync(int id)
        {
            return await _context.Views.FindAsync(id);
        }

        public async Task<IEnumerable<View>> GetViewsByPostIdAsync(int postId)
        {
            return await _context.Views
       .Where(v => v.PostId == postId)
       .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetViewersByPostId(int postId)
        {
            var viewerUserIds = await _context.Views
                .Where(v => v.PostId == postId)
                .Select(v => v.UserId)
                .ToListAsync();

            var viewers = await _context.Users
                .Where(u => viewerUserIds.Contains(u.UserId))
                .ToListAsync();

            return viewers;
        }

        public async Task<IDictionary<string, int>> GetViewCountsByGenderAsync(int postId)
        {
            var viewCounts = await _context.Views
                .Where(v => v.PostId == postId)
                .Join(_context.Users,
                    v => v.UserId,
                    u => u.UserId,
                    (v, u) => new { u.Gender })
                .GroupBy(x => x.Gender)
                .Select(g => new { Gender = g.Key, ViewCount = g.Count() })
                .ToListAsync();

            return viewCounts.ToDictionary(x => x.Gender, x => x.ViewCount);
        }

        public async Task<IDictionary<string, int>> GetViewCountsByAgeGroupAsync(int postId)
        {
            var usersWithViews = await _context.Views
                .Where(v => v.PostId == postId)
                .Join(_context.Users,
                    v => v.UserId,
                    u => u.UserId,
                    (v, u) => new { u.DateOfBirth })
                .ToListAsync();

            var ageGroups = usersWithViews
                .Select(x => new
                {
                    AgeGroup = (DateTime.Now.Year - x.DateOfBirth.Year) switch
                    {
                        var age when age >= 18 && age <= 24 => "18-24",
                        var age when age >= 25 && age <= 34 => "25-34",
                        var age when age >= 35 && age <= 44 => "35-44",
                        var age when age >= 45 && age <= 54 => "45-54",
                        var age when age >= 55 && age <= 64 => "55-64",
                        _ => "65+"
                    }
                })
                .GroupBy(x => x.AgeGroup)
                .Select(g => new { AgeGroup = g.Key, ViewCount = g.Count() })
                .ToList();

            return ageGroups.ToDictionary(x => x.AgeGroup, x => x.ViewCount);
        }


        public async Task UpdateViewAsync(View view)
        {
            _context.Entry(view).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task CreateViewAsync(View view)
        {
            _context.Views.Add(view);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteViewAsync(int id)
        {
            var view = await _context.Views.FindAsync(id);
            if (view != null)
            {
                _context.Views.Remove(view);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> DoesViewExistAsync(int postId, int userId)
        {
            return await _context.Views.AnyAsync(e => e.PostId == postId && e.UserId == userId);
        }
    }
}
