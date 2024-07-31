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
using Microsoft.Extensions.Hosting;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowReactFrontend")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesService _categoryService;
        
        public CategoriesController(ICategoriesService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult> GetCategories()
        {
            var categories =  await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // GET: api/Categories/titles
        [HttpGet("titles")]
        public async Task<ActionResult> GetCategoryTitles()
        {
            var categoryTitles = await _categoryService.GetAllCategoryTitlesAsync();
            return Ok(categoryTitles);
        }


        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }


        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest();
            }

            try
            {
                await _categoryService.UpdateCategoryAsync(category);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (! await _categoryService.DoesCategoryExistAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            await _categoryService.CreateCategoryAsync(category);

            return CreatedAtAction("GetCategory", new { id = category.CategoryId }, category);
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            await _categoryService.DeleteCategoryAsync(id);

            return NoContent();
        }

        private async Task<bool> CategoryExists(int id)
        {
            return await _categoryService.DoesCategoryExistAsync(id);
        }
    }
}
