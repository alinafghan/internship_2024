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
using Application.Services;
using Application.Interfaces;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowReactFrontend")]

    public class postCategoriesController : ControllerBase
    {
        private readonly IPostCategoriesService _postCategoriesService;

        public postCategoriesController(IPostCategoriesService postCategoriesService)
        {
            _postCategoriesService = postCategoriesService;
        }

        // GET: api/postCategories
        [HttpGet]
        public async Task<ActionResult> GetPostCategories()
        {
            var postCategories = await _postCategoriesService.GetAllPostCategoriesAsync();
            return Ok(postCategories);
        }

        // GET: api/postCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetpostCategory(int id)
        {
            var postCategory = await _postCategoriesService.GetPostCategoryByIdAsync(id);

            if (postCategory == null)
            {
                return NotFound();
            }

            return Ok(postCategory);
        }

        // PUT: api/postCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutpostCategory(int id, postCategory postCategory)
        {
            if (id != postCategory.CategoryId)
            {
                return BadRequest();
            }

            try
            {
                await _postCategoriesService.UpdatePostCategoryAsync(
                    postCategory);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (! await _postCategoriesService.DoesPostCategoryExist(id, postCategory.CategoryId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Categories added successfully" });
        }

        // POST: api/postCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostpostCategory(postCategory postCategory)
        {

   
            await _postCategoriesService.CreatePostCategoryAsync(postCategory);

            return CreatedAtAction("GetpostCategory", new { id = postCategory.CategoryId }, postCategory);
        }

        // DELETE: api/postCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletepostCategory(postCategory postCategory)
        {
            await _postCategoriesService.DeletePostCategoryAsync(postCategory);
            return NoContent();
        }

        private Task<bool> postCategoryExists(int id, int postId)
        {
            return _postCategoriesService.DoesPostCategoryExist(id, postId);
        }
    }
}
