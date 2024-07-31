// AccountController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Domain.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Infrastructure.Persistence;
using Domain.DTOs;
using Microsoft.Identity.Client;
using Application.Interfaces;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _accountService.Login(model);

            if (user == false)
            {
                return Ok(new { status = "failure", message = "This user does not exist." });
            }

            return Ok(new { status = "success", message = "Login successful" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _accountService.Logout();
            return Ok(new { status = "success", message = "Logout successful" });
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var user = await _accountService.GetUser();

            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                UserId = user.UserId,
                Username = user.UserName,
                Role = user.UserRole,
                Email = user.Email,
                Gender = user.Gender,
                PassHash = user.PassHash,
                FirstName = user.FirstName,
                LastName = user.LastName
            });
        }
    }
}
