using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Interfaces
{
    public interface ICommentsService
    {
        Task<IEnumerable<Comment>> GetAllCommentsAsync();
        Task<Comment> GetCommentByIdAsync(int id);
        Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(int PostId);

        Task<IDictionary<string, int>> GetCommentCountByGenderAsync(int postId);
        Task<IDictionary<string, int>> GetCommentCountByAgeGroupAsync(int postId);
        Task<IEnumerable<CommentWithUserDTO>> GetCommentsWithUserByPostIdAsync(int PostId);
        Task CreateCommentAsync(Comment Comment);
        Task UpdateCommentAsync(Comment Comment);
        Task DeleteCommentAsync(int id);
        Task<bool> DoesCommentExist(int id);
    }
}
