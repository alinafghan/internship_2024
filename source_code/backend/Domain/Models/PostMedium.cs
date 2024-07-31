using System;
using System.Collections.Generic;


namespace Domain.Models;

public partial class PostMedium
{
    public int MediaId { get; set; }

    public int? PostId { get; set; }

    public string MediaUrl { get; set; } = null!;

    public string? Caption { get; set; }

    public int MediaType { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Post? Post { get; set; }
}
