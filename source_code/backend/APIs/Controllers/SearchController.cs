using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Microsoft.AspNetCore.Cors;
using Infrastructure.Persistence;
using Application.Interfaces;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowReactFrontend")]

    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet("by-category/{categoryName}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetPostsByCategoryName(string categoryName)
        {
            var posts = await _searchService.GetPostsByCategoryName(categoryName);

            if (posts == null || !posts.Any())
            {
                return NotFound(new { message = "No posts found for the specified category name." });
            }

            return Ok(posts);
        }


    }
}