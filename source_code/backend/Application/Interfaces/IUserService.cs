using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task CreateUserAsync(User user);
        Task<bool> UpdateUserAsync(int id, User user, IFormFile? profilePic);
        Task DeleteUserAsync(int id);
        Task<string> SaveProfilePictureAsync(IFormFile profilePic);

        Task<bool> DoesUserExist(int id);
    }
}
