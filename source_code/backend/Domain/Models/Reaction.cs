using System;
using System.Collections.Generic;


namespace Domain.Models;


public partial class Reaction
{
    public int ReactionId { get; set; }

    public string? ReactionDesc { get; set; }

    public byte[] Emoji { get; set; } = null!;

    public virtual ICollection<PostReaction> PostReactions { get; set; } = new List<PostReaction>();
}
