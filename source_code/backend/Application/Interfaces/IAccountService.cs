using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Domain.DTOs;

namespace Application.Interfaces
{
    public interface IAccountService
    {
        Task<bool> Login (LoginDTO model);
        Task Logout();
        Task <User> GetUser();
    }
}
