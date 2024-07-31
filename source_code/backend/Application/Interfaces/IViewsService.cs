using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IViewsService
    {
        Task<IEnumerable<View>> GetAllViewsAsync();
        Task<IEnumerable<User>> GetViewersByPostId(int postId);
        Task<IDictionary<string, int>> GetViewCountsByGenderAsync(int postId);
        Task<IDictionary<string, int>> GetViewCountsByAgeGroupAsync(int postId);

        Task<View> GetViewByIdAsync(int id);
        Task CreateViewAsync(View View);
        Task UpdateViewAsync(View View);
        Task DeleteViewAsync(int id);
        Task<bool> DoesViewExistAsync(int PostId, int UserId);
    }
}
