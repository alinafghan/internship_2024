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

    public class RatingsController : ControllerBase
    {
        private readonly IRatingsService _ratingsService;
        public RatingsController(IRatingsService ratingsService)
        {
            _ratingsService = ratingsService;
        }

        // GET: api/Ratings
        [HttpGet]
        public async Task<ActionResult> GetRatings()
        {
            var ratings = await _ratingsService.GetAllRatingsAsync();
            return Ok(ratings);
        }

        // GET: api/Ratings/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetRatingByPostId(int id)
        {
            var ratings = await _ratingsService.GetRatingByPostIdAsync(id);

            if (ratings == null || !ratings.Any())
            {
                return NotFound();
            }

            return Ok(ratings);
        }

        [HttpGet("/post/{postId}/user/{userId}")]
        public async Task<ActionResult> GetRatingByPostIdAndUserId(int postId, int userId)
        {
            var ratings = await _ratingsService.GetRatingByPostIdAndUserIdAsync(postId, userId);

            if (ratings == null)
            {
                return NotFound();
            }

            return Ok(ratings);
        }

        // PUT: api/Ratings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRating(int id, Rating rating)
        {
            if (id != rating.PostId)
            {
                return BadRequest();
            }

            try
            {
                await _ratingsService.UpdateRatingAsync(rating);
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!await _ratingsService.DoesRatingExist(rating.PostId, rating.UserId))
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

        [HttpGet("post/{postId}/gender")]
        public async Task<IActionResult> GetRatingAvgByGender(int postId)
        {
            var result = await _ratingsService.GetRatingAvgByGenderAsync(postId);
            return Ok(result);
        }

        [HttpGet("post/{postId}/age-groups")]
        public async Task<IActionResult> GetRatingAvgByAgeGroup(int postId)
        {
            var result = await _ratingsService.GetRatingAvgByAgeGroupAsync(postId);
            return Ok(result);
        }

        // POST: api/Ratings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostRating(Rating rating)
        {
            try
            {
                await _ratingsService.CreateRatingAsync(rating);
            }
            catch (DbUpdateException)
            {
                if (await _ratingsService.DoesRatingExist(rating.PostId, rating.UserId))
                {
                    return Ok(new { message = "You have already rated this post." });
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetRatingByPostIdAndUserId), new { postId = rating.PostId, userId = rating.UserId }, rating);
        }

        // DELETE: api/Ratings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(Rating rating)
        {
            await _ratingsService.DeleteRatingAsync(rating);

            return NoContent();
        }

        private Task<bool> RatingExists(int PostId, int UserId)
        {
            return _ratingsService.DoesRatingExist(PostId, UserId);
        }

    }
}
