using Domain.Models;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Application.Interfaces;
using BCrypt.Net;


namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly BlogDbContext _context;

        public UserService(BlogDbContext context) { _context = context; }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> UpdateUserAsync(int id, User user, IFormFile? profilePic)
        {
            var existingUser = await GetUserByIdAsync(id);

            if (existingUser == null)
            {
                return false;
            }

            existingUser.UserName = user.UserName;
            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            existingUser.PhoneNum = user.PhoneNum;
            existingUser.PassHash = user.PassHash;
            existingUser.Gender = user.Gender;
            existingUser.DateOfBirth = user.DateOfBirth;
            existingUser.About = user.About;

            if (!string.IsNullOrWhiteSpace(user.PassHash))
            {
                existingUser.PassHash = BCrypt.Net.BCrypt.HashPassword(user.PassHash);
            }

            if (profilePic != null)
            {
                var fileName = await SaveProfilePictureAsync(profilePic);

                if (fileName != null)
                {
                    existingUser.ProfilePic = fileName;
                }
            }

            _context.Entry(existingUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await DoesUserExist(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<bool> DoesUserExist(int id)
        {
            return await _context.Users.AnyAsync(e => e.UserId == id);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

        }

        public async Task CreateUserAsync(User user)

        {
            user.PassHash = BCrypt.Net.BCrypt.HashPassword(user.PassHash);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<string> SaveProfilePictureAsync(IFormFile profilePic)
        {

            var fileName = $"{Guid.NewGuid()}_{profilePic.FileName}";
            var filePath = Path.Combine("wwwroot", "uploads", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await profilePic.CopyToAsync(stream);
            }

            return fileName;
        }
    }
}
