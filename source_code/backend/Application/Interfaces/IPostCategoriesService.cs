using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPostCategoriesService
    {
        Task<IEnumerable<postCategory>> GetAllPostCategoriesAsync();
        Task<postCategory> GetPostCategoryByIdAsync(int id);
        Task CreatePostCategoryAsync(postCategory postCategory);
        Task UpdatePostCategoryAsync(postCategory postCategory);
        Task DeletePostCategoryAsync(postCategory postCategory);

        Task<bool> DoesPostCategoryExist(int id, int id2);
    }
}
