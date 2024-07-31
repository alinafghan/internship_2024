using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Microsoft.AspNetCore.Cors;
using Infrastructure.Persistence;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Application.Services;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowReactFrontend")]
    public class UsersController : ControllerBase
    {
        private readonly string _uploadsFolderPath;
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
            _uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(_uploadsFolderPath))
            {
                Directory.CreateDirectory(_uploadsFolderPath);
            }
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult> PostUsers(User user)
        {
            try
            {
                await _userService.CreateUserAsync(user);

                var options = new JsonSerializerOptions
                {
                    WriteIndented = true
                };

                var json = JsonSerializer.Serialize(user, options);
                Console.WriteLine(json); // Log or inspect the JSON output

            }
            catch (DbUpdateException)
            {
                return Ok(new { message = "This Username has already been taken." });
            }

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, User);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(user.ProfilePic))
            {
                var fileName = Path.GetFileName(user.ProfilePic);
                user.ProfilePic = $"http://localhost:5232/uploads/{fileName}";
            }

            return user;
        }

        private async Task<string> SaveProfilePicture(IFormFile file)
        {

            if (file == null || file.Length == 0)
                return null;

            var filePath = Path.Combine(_uploadsFolderPath, Path.GetFileName(file.FileName));
            var fileName = Path.GetFileName(file.FileName);

            // Save the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromForm] User user, IFormFile? profilePic)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            try
            {

                var result = await _userService.UpdateUserAsync(id, user, profilePic);

                if (!result)
                {
                    return NotFound();
                }
            }
            catch (DbUpdateException)
            {
                return Ok(new { message = "This Username has already been taken." });
            }

            return Ok(new { message = "Profile updated successfully" });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }

        private Task<bool> UserExists(int id)
        {
            return _userService.DoesUserExist(id);
        }
    }
}
