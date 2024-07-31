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

    public class ViewsController : ControllerBase
    {
        private readonly IViewsService _viewsService;

        public ViewsController(IViewsService viewsService)
        {
            _viewsService = viewsService;
        }

        // GET: api/Views
        [HttpGet]
        public async Task<ActionResult> GetViews()
        {
            var views = await _viewsService.GetAllViewsAsync();
            return Ok(views);
        }

     
        [HttpGet("post/{id}/viewers")]

        public async Task<ActionResult> GetViewersByPostId(int id)
        {
            var viewers = await _viewsService.GetViewersByPostId(id);
            return Ok(viewers);
        }

        [HttpGet("post/{postId}/gender")]
        public async Task<IActionResult> GetViewCountsByGender(int postId)
        {
            var result = await _viewsService.GetViewCountsByGenderAsync(postId);
            return Ok(result);
        }

        [HttpGet("post/{postId}/age-groups")]
        public async Task<IActionResult> GetViewCountsByAgeGroup(int postId)
        {
            var result = await _viewsService.GetViewCountsByAgeGroupAsync(postId);
            return Ok(result);
        }

        // GET: api/Views/5
        [HttpGet("{id}")]
        public async Task<ActionResult<View>> GetView(int id)
        {
            var view = await _viewsService.GetViewByIdAsync(id);

            if (view == null)
            {
                return NotFound();
            }

            return Ok(view);
        }

        // PUT: api/Views/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutView(int id, View view)
        {
            if (id != view.PostId)
            {
                return BadRequest();
            }

            try
            {
                await _viewsService.UpdateViewAsync(view);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _viewsService.DoesViewExistAsync(id, view.UserId))
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

        // POST: api/Views
        [HttpPost]
        public async Task<ActionResult<View>> PostView(View view)
        {
            try
            {
                await _viewsService.CreateViewAsync(view);
            }
            catch (DbUpdateException)
            {
                if (await _viewsService.DoesViewExistAsync(view.PostId, view.UserId))
                {
                    return Ok(new { message = "View already recorded." });
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetView), new { id = view.PostId }, view);
        }

        // DELETE: api/Views/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteView(int id)
        {
            var view = await _viewsService.GetViewByIdAsync(id);
            if (view == null)
            {
                return NotFound();
            }

            await _viewsService.DeleteViewAsync(id);

            return NoContent();
        }
    }
}
