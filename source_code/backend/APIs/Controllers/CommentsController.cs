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
using System.Xml.Linq;

namespace backend2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowReactFrontend")]

    public class CommentsController : ControllerBase
    {
        private readonly ICommentsService _commentsService;

        public CommentsController(ICommentsService commentsService)
        {
            _commentsService = commentsService;
        }

        // GET: api/Comments
        [HttpGet]
        public async Task<ActionResult> GetComments()
        {
            var comments = await _commentsService.GetAllCommentsAsync();
            return Ok(comments);
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetComment(int id)
        {
            var comment = await _commentsService.GetCommentByIdAsync(id);

            return Ok(comment);
        }

        [HttpGet("post/{postId}/gender")]
        public async Task<IActionResult> GetCommentCountsByGender(int postId)
        {
            var result = await _commentsService.GetCommentCountByGenderAsync(postId);
            return Ok(result);
        }

        [HttpGet("post/{postId}/age-groups")]
        public async Task<IActionResult> GetCommentCountsByAgeGroup(int postId)
        {
            var result = await _commentsService.GetCommentCountByAgeGroupAsync(postId);
            return Ok(result);
        }

        [HttpGet("post/{postId}")]
        public async Task<ActionResult> GetCommentsByPostId(int postId)
        {

            var comments = await _commentsService.GetCommentsByPostIdAsync(postId);

            var commentsList = comments.ToList();

            if (commentsList == null || commentsList.Count == 0)
            {
                return NotFound();
            }

            return Ok(commentsList);
        }

        [HttpGet("post/{postId}/with-user")]
        public async Task<ActionResult> GetCommentsWithUserByPostId(int postId)
        {
            //var commentsWithUser = await (from comment in _commentsService.Comments
            //                              join user in _commentsService.Users
            //                              on comment.UserId equals user.UserId
            //                              where comment.PostId == postId
            //                              select new CommentWithUserDto
            //                              {
            //                                  CommentId = comment.CommentId,
            //                                  Content = comment.Content,
            //                                  CreatedAt = comment.CreatedAt,
            //                                  UpdatedAt = comment.UpdatedAt,
            //                                  PostId = comment.PostId,
            //                                  UserId = user.UserId,
            //                                  UserName = user.UserName,
            //                                  ProfilePic = user.ProfilePic
            //                              }).ToListAsync();

            var commentsWithUser = await _commentsService.GetCommentsWithUserByPostIdAsync(postId);

            var commentsWithUserList = commentsWithUser.ToList();

            if (commentsWithUserList == null || commentsWithUserList.Count == 0)
            {
                return NotFound();
            }

            //foreach (var comment in commentsWithUser)
            //{
            //    if (!string.IsNullOrEmpty(comment.ProfilePic))
            //    {
            //        var fileName = Path.GetFileName(comment.ProfilePic);
            //        comment.ProfilePic = $"http://localhost:5232/uploads/{fileName}";
            //    }
            //}

            return Ok(commentsWithUser);
        }


        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, Comment comment)
        {
            if (id != comment.CommentId)
            {
                return BadRequest();
            }

            //_commentsService.Entry(comment).State = EntityState.Modified;

            try
            {
                await _commentsService.UpdateCommentAsync(comment);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _commentsService.DoesCommentExist(id))
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

        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostComment(Comment comment)
        {
            await _commentsService.CreateCommentAsync(comment);

            return CreatedAtAction("GetComment", new { id = comment.CommentId }, comment);
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            await _commentsService.DeleteCommentAsync(id);

            return NoContent();
        }

        private Task<bool> CommentExists(int id)
        {
            return _commentsService.DoesCommentExist(id);
        }
    }
}
