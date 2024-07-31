using Domain.Models;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Application.Interfaces;

namespace Application.Services
{
    public class CommentsService : ICommentsService
    {
        private readonly BlogDbContext _context;

        public CommentsService(BlogDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Comment>> GetAllCommentsAsync()
        {
            return await _context.Comments.ToListAsync();
        }

        public async Task<Comment> GetCommentByIdAsync(int id)
        {
            return await _context.Comments.FindAsync(id);
        }

        public async Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(int postId)
        {
            return await _context.Comments
                                 .Where(comment => comment.PostId == postId)
                                 .ToListAsync();
        }

        public async Task<IDictionary<string, int>> GetCommentCountByGenderAsync(int postId)
        {
            var viewCounts = await _context.Comments
                .Where(v => v.PostId == postId)
                .Join(_context.Users,
                    v => v.UserId,
                    u => u.UserId,
                    (v, u) => new { u.Gender })
                .GroupBy(x => x.Gender)
                .Select(g => new { Gender = g.Key, CommentCount = g.Count() })
                .ToListAsync();

            return viewCounts.ToDictionary(x => x.Gender, x => x.CommentCount);
        }

        public async Task<IDictionary<string, int>> GetCommentCountByAgeGroupAsync(int postId)
        {
            var usersWithComments = await _context.Comments
                .Where(v => v.PostId == postId)
                .Join(_context.Users,
                    v => v.UserId,
                    u => u.UserId,
                    (v, u) => new { u.DateOfBirth })
                .ToListAsync();

            var ageGroups = usersWithComments
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
                .Select(g => new { AgeGroup = g.Key, CommentCount = g.Count() })
                .ToList();

            return ageGroups.ToDictionary(x => x.AgeGroup, x => x.CommentCount);
        }



        public async Task<IEnumerable<CommentWithUserDTO>> GetCommentsWithUserByPostIdAsync(int postId)
        {
            var commentsWithUser = await (from comment in _context.Comments
                                          join user in _context.Users
                                          on comment.UserId equals user.UserId
                                          where comment.PostId == postId
                                          select new CommentWithUserDTO
                                          {
                                              CommentId = comment.CommentId,
                                              Content = comment.Content,
                                              CreatedAt = comment.CreatedAt,
                                              UpdatedAt = comment.UpdatedAt,
                                              PostId = comment.PostId,
                                              UserId = user.UserId,
                                              UserName = user.UserName,
                                              ProfilePic = user.ProfilePic
                                          }).ToListAsync();

            return commentsWithUser;
        }

        public async Task CreateCommentAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCommentAsync(Comment comment)
        {
            _context.Entry(comment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCommentAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<bool> DoesCommentExist(int id)
        {
            return await _context.Comments.AnyAsync(e => e.CommentId == id);
        }

    }

}
