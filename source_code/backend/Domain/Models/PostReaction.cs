using System;
using System.Collections.Generic;


namespace Domain.Models;

public partial class PostReaction
{
    public int ReactionId { get; set; }

    public int PostId { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Post Post { get; set; } = null!;

    public virtual Reaction Reaction { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
