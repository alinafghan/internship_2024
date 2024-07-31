using System;
using System.Collections.Generic;

namespace Domain.Models
{


    public partial class Post
    {
        public int PostId { get; set; }

        public string Title { get; set; } = null!;

        public string? Content { get; set; }

        public int? NumViews { get; set; }

        public int? AvgRating { get; set; }

        public int? NumRatings { get; set; }

        public int? NumComments { get; set; }

        public int? EditorId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string? HeaderImage { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public virtual User? Editor { get; set; } = null!;

        public virtual ICollection<PostMedium> PostMedia { get; set; } = new List<PostMedium>();

        public virtual ICollection<PostReaction> PostReactions { get; set; } = new List<PostReaction>();

        public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

        public virtual ICollection<View> Views { get; set; } = new List<View>();

        //public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

        public virtual ICollection<postCategory> PostCategories { get; set; } = new List<postCategory>();
    }


}