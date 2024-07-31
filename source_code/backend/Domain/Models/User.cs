using System;
using System.Collections.Generic;


namespace Domain.Models;


public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PhoneNum { get; set; }

    public DateTime DateOfBirth { get; set; }

    public string? CityStateCountry { get; set; }

    public string PassHash { get; set; } = null!;

    public int UserRole { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string? About { get; set; }

    public string? ProfilePic { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<PostReaction> PostReactions { get; set; } = new List<PostReaction>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    public virtual ICollection<View> Views { get; set; } = new List<View>();

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
}
