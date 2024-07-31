using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<Post>> GetPostsbyEditorId(int id);
        Task<object> GetPaginatedPostsAsync(int page, int limit);
        Task<Post> GetPostByIdAsync(int id);
        Task CreatePostAsync(Post post);
        Task UpdatePostAsync(Post post);
        Task DeletePostAsync(Post post);
        Task<bool> DoesPostExist(int id);
    }
}
