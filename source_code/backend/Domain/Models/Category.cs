using System;
using System.Collections.Generic;
using Domain.Models;
using Microsoft.EntityFrameworkCore;


namespace Domain.Models;


public partial class Category
{
    public int CategoryId { get; set; }

    public string Title { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();

    public virtual ICollection<postCategory> PostCategories { get; set; } = new List<postCategory>();

}