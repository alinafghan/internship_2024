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
    public class RatingsService : IRatingsService
    {
        private readonly BlogDbContext _context;

        public RatingsService(BlogDbContext context) { _context = context; }

        public async Task<IEnumerable<Rating>> GetAllRatingsAsync()
        {
            return await _context.Ratings.ToListAsync();
        }


        public async Task<IEnumerable<Rating>> GetRatingByPostIdAsync(int postId)
        {
            return await _context.Ratings
       .Where(r => r.PostId == postId)
       .ToListAsync();
        }

        public async Task<Rating> GetRatingByPostIdAndUserIdAsync(int postId, int userId)
        {
            return await _context.Ratings
                .Where(r => r.PostId == postId && r.UserId == userId)
                .FirstOrDefaultAsync();
        }

        public async Task<IDictionary<string, int>> GetRatingAvgByGenderAsync(int postId)
        {
            var RatingCounts = await _context.Ratings
                .Where(v => v.PostId == postId)
                .Join(_context.Users,
                    v => v.UserId,
                    u => u.UserId,
                    (v, u) => new { u.Gender })
                .GroupBy(x => x.Gender)
                .Select(g => new { Gender = g.Key, RatingCount = g.Count() })
                .ToListAsync();

            return RatingCounts.ToDictionary(x => x.Gender, x => x.RatingCount);
        }

        public async Task<IDictionary<string, int>> GetRatingAvgByAgeGroupAsync(int postId)
        {
            var usersWithRatings = await _context.Ratings
                .Where(v => v.PostId == postId)
                .Join(_context.Users,
                    v => v.UserId,
                    u => u.UserId,
                    (v, u) => new { u.DateOfBirth })
                .ToListAsync();

            var ageGroups = usersWithRatings
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
                .Select(g => new { AgeGroup = g.Key, RatingCount = g.Count() })
                .ToList();

            return ageGroups.ToDictionary(x => x.AgeGroup, x => x.RatingCount);
        }


        public async Task UpdateRatingAsync(Rating Rating)
        {
            _context.Entry(Rating).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task CreateRatingAsync(Rating Rating)
        {
            _context.Ratings.Add(Rating);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRatingAsync(Rating rating)
        {

            _context.Ratings.Remove(rating);
            await _context.SaveChangesAsync();

        }
        public async Task<bool> DoesRatingExist(int postId, int userId)
        {
            return await _context.Ratings.AnyAsync(r => r.PostId == postId && r.UserId == userId);
        }
    }
}
