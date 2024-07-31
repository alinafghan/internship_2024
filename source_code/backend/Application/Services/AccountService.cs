using Domain.DTOs;
using Domain.Models;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly BlogDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AccountService> _logger;

        public AccountService(BlogDbContext context, IHttpContextAccessor httpContextAccessor, ILogger<AccountService> logger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;

        }
        public async Task<bool> Login(LoginDTO model)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == model.UserName);

            _logger.LogWarning("logger is working.");

            if (user != null && BCrypt.Net.BCrypt.Verify(model.PassHash, user.PassHash))
            {
                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim("UserRole", user.UserRole.ToString()),
                new Claim("Email", user.Email),
                new Claim("Gender", user.Gender),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim("PassHash", user.PassHash)
            };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30)
                };

                await _httpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
                return true;
            }

            return false;
        }

        public async Task Logout()
        {
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        public async Task<User> GetUser()
        {
            var user = _httpContextAccessor.HttpContext.User;

            if (user.Identity.IsAuthenticated)
            {
                var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (int.TryParse(userId, out int id))
                {
                    var retrievedUser = await _context.Users.FindAsync(id);
                    return retrievedUser;
                }
            }

            return null;
        }
    }
}
