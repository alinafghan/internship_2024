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

    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly IWebHostEnvironment _environment;

        public PostsController(IPostService postService, IWebHostEnvironment environment)
        {
            _postService = postService;
            _environment = environment;
        }


        // // GET: api/Posts
        // [HttpGet]
        // public async Task<ActionResult> GetPosts()
        // {
        //     var posts = await _postService.GetAllPostsAsync();
        //     return Ok(posts);
        // }

        [HttpGet]
        public async Task<ActionResult> GetPosts(int page = 1, int limit = 10)
        {
            try
            {
                var result = await _postService.GetPaginatedPostsAsync(page, limit);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("editor/{id}")]
        public async Task<ActionResult> GetPostsbyEditorId(int id)
        {
            var post = await _postService.GetPostsbyEditorId(id);
            return Ok(post);
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPost(int id)
        {
            var post = await _postService.GetPostByIdAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);
        }

        // PUT: api/Posts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(int id, Post post)
        {
            if (id != post.PostId)
            {
                return BadRequest();
            }

            //_postService.Entry(post).State = EntityState.Modified;

            try
            {
                await _postService.UpdatePostAsync(post);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _postService.DoesPostExist(id))
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

        [HttpPost]
        public async Task<ActionResult<object>> PostPost([FromForm] Post post, IFormFile? headerImage)
        {
            if (headerImage != null)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + headerImage.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await headerImage.CopyToAsync(fileStream);
                }

                post.HeaderImage = "http://localhost:5232/uploads/" + uniqueFileName;
            }

            await _postService.CreatePostAsync(post);

            // Assuming you have a success message string
            string successMessage = "Post created succesfully";

            // Return an anonymous object with post and message
            return new { Post = post, Message = successMessage };
        }

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)

        {

            var postToDelete = await _postService.GetPostByIdAsync(id);
            await _postService.DeletePostAsync(postToDelete);

            return NoContent();
        }

        private Task<bool> PostExists(int id)
        {
            return _postService.DoesPostExist(id);
        }
    }
}
