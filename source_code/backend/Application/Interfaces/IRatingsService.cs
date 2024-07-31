using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IRatingsService
    {
        Task<IEnumerable<Rating>> GetAllRatingsAsync();
        Task<IEnumerable<Rating>> GetRatingByPostIdAsync(int PostId);

        Task<Rating> GetRatingByPostIdAndUserIdAsync(int postId, int userId);
        Task CreateRatingAsync(Rating Rating);
        Task UpdateRatingAsync(Rating Rating);
        Task DeleteRatingAsync(Rating rating);
        Task<bool> DoesRatingExist(int PostId, int UserId);

        Task<IDictionary<string, int>> GetRatingAvgByGenderAsync(int postId);
        Task<IDictionary<string, int>> GetRatingAvgByAgeGroupAsync(int postId);
    }
}
