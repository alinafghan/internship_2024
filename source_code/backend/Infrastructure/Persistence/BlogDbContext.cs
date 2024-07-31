using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Infrastructure.Persistence;

namespace Infrastructure.Persistence
{

    public partial class BlogDbContext : DbContext
    {
        public BlogDbContext()
        {
        }

        public BlogDbContext(DbContextOptions<BlogDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Comment> Comments { get; set; }

        public virtual DbSet<Post> Posts { get; set; }

        public virtual DbSet<PostMedium> PostMedia { get; set; }

        public virtual DbSet<PostReaction> PostReactions { get; set; }

        public virtual DbSet<Rating> Ratings { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<View> Views { get; set; }

        public virtual DbSet<postCategory> PostCategories { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer("server=TABLET-D8P5T541;Database=blog_db;Trusted_Connection=true;TrustServerCertificate=true");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.CategoryId).HasName("PK__category__D54EE9B4B015A6EA");

                entity.ToTable("category");

                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("title");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.CommentId).HasName("PK__comments__E79576873282A0E2");

                entity.ToTable("comments", tb =>
                    {
                        tb.HasTrigger("comment_created_at");
                        tb.HasTrigger("comment_updated_at");
                        tb.HasTrigger("num_comments_trigger");
                    });

                entity.Property(e => e.CommentId).HasColumnName("comment_id");
                entity.Property(e => e.Content)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("content");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                //entity.HasOne(d => d.Post).WithMany(p => p.Comments)
                //    .HasForeignKey(d => d.PostId)
                //    .HasConstraintName("fk_post_id_comments");

                //entity.HasOne(d => d.User).WithMany(p => p.Comments)
                //    .HasForeignKey(d => d.UserId)
                //    .OnDelete(DeleteBehavior.ClientSetNull)
                //    .HasConstraintName("fk_user_id_comments");
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.PostId).HasName("PK__posts__3ED787666CAA46D0");

                entity.ToTable("posts", tb =>
                    {
                        tb.HasTrigger("post_created_at");
                        tb.HasTrigger("post_updated_at");
                    });

                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.AvgRating).HasColumnName("avg_rating");
                entity.Property(e => e.Content)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("content");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.EditorId).HasColumnName("editor_id").IsRequired();
                entity.Property(e => e.NumComments).HasColumnName("num_comments");
                entity.Property(e => e.NumRatings).HasColumnName("num_ratings");
                entity.Property(e => e.NumViews).HasColumnName("num_views");
                entity.Property(e => e.Title)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("title");
                entity.Property(e => e.HeaderImage)
                     .HasColumnName("header_image");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");

                entity.HasOne(d => d.Editor).WithMany(p => p.Posts)
                    .HasForeignKey(d => d.EditorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_editor_id");
            });

            modelBuilder.Entity<PostMedium>(entity =>
            {
                entity.HasKey(e => e.MediaId).HasName("PK__post_med__D0A840F4294C0883");

                entity.ToTable("post_media");

                entity.Property(e => e.MediaId)
                    .ValueGeneratedNever()
                    .HasColumnName("media_id");
                entity.Property(e => e.Caption)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("caption");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.MediaType).HasColumnName("media_type");
                entity.Property(e => e.MediaUrl)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("media_url");
                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");

                entity.HasOne(d => d.Post).WithMany(p => p.PostMedia)
                    .HasForeignKey(d => d.PostId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_post_id");
            });

            modelBuilder.Entity<PostReaction>(entity =>
            {
                entity.HasKey(e => new { e.ReactionId, e.PostId, e.UserId }).HasName("PK__post_rea__4BFD14D9A7533942");

                entity.ToTable("post_reactions", tb =>
                    {
                        tb.HasTrigger("reaction_created_at");
                        tb.HasTrigger("reaction_updated_at");
                    });

                entity.Property(e => e.ReactionId).HasColumnName("reaction_id");
                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");

                entity.HasOne(d => d.Post).WithMany(p => p.PostReactions)
                    .HasForeignKey(d => d.PostId)
                    .HasConstraintName("fk_post_id_reactions");

                entity.HasOne(d => d.Reaction).WithMany(p => p.PostReactions)
                    .HasForeignKey(d => d.ReactionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_reaction_id");

                entity.HasOne(d => d.User).WithMany(p => p.PostReactions)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_user_id_reactions");
            });

            modelBuilder.Entity<postCategory>(entity =>
            {
                entity.HasKey(e => new { e.CategoryId, e.PostId }).HasName("PK_postCategory");

                entity.ToTable("post_category");

                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.PostId).HasColumnName("post_id");

                // entity.HasOne(d => d.Category).WithMany(p => p.PostCategories)
                //     .HasForeignKey(d => d.CategoryId)
                //     .OnDelete(DeleteBehavior.ClientSetNull)
                //     .HasConstraintName("FK_category_id");

                // entity.HasOne(d => d.Post).WithMany(p => p.PostCategories)
                //     .HasForeignKey(d => d.PostId)
                //     .OnDelete(DeleteBehavior.ClientSetNull)
                //     .HasConstraintName("FK_post_id");
            });

            modelBuilder.Entity<Rating>(entity =>
            {
                entity.HasKey(e => new { e.PostId, e.UserId }).HasName("PK__rating__D54C6416536EBC45");

                entity.ToTable("rating", tb =>
                    {
                        tb.HasTrigger("avg_rating_trigger");
                        tb.HasTrigger("num_ratings_trigger");
                        tb.HasTrigger("rating_created_at");
                        tb.HasTrigger("rating_updated_at");
                    });

                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.Rating1).HasColumnName("rating");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");

                // entity.HasOne(d => d.Post).WithMany(p => p.Ratings)
                //     .HasForeignKey(d => d.PostId)
                //     .HasConstraintName("fk_post_id_rating");

                // entity.HasOne(d => d.User).WithMany(p => p.Ratings)
                //     .HasForeignKey(d => d.UserId)
                //     .OnDelete(DeleteBehavior.ClientSetNull)
                //     .HasConstraintName("fk_user_id_rating");
            });

            modelBuilder.Entity<Reaction>(entity =>
            {
                entity.HasKey(e => e.ReactionId).HasName("PK__reaction__36A9D298D3767D56");

                entity.ToTable("reactions");

                entity.Property(e => e.ReactionId).HasColumnName("reaction_id");
                entity.Property(e => e.Emoji)
                    .HasColumnType("image")
                    .HasColumnName("emoji");
                entity.Property(e => e.ReactionDesc)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("reaction_desc");
            });

            modelBuilder.Entity<User>(entity =>
            {

                entity.HasMany(e => e.Posts)
                .WithOne(e => e.Editor)
                .HasForeignKey(e => e.EditorId)
                .HasConstraintName("fk_editor_id");
                entity.HasKey(e => e.UserId).HasName("PK__users__B9BE370F5C36B11F");

                entity.ToTable("users", tb =>
                    {
                        tb.HasTrigger("user_created_at");
                        tb.HasTrigger("user_updated_at");
                    });

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.About)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("about");
                entity.Property(e => e.DateOfBirth).HasColumnName("DateOfBirth").HasColumnType("datetime");
                entity.Property(e => e.CityStateCountry)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("city_state_country");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("email");
                entity.Property(e => e.FirstName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("first_name");
                entity.Property(e => e.LastName)
                   .HasMaxLength(255)
                   .IsUnicode(false)
                   .HasColumnName("last_name");
                entity.Property(e => e.Gender)
                   .HasMaxLength(255)
                   .IsUnicode(false)
                   .HasColumnName("gender");
                entity.Property(e => e.PassHash)
                    .HasMaxLength(12)
                    .IsUnicode(false)
                    .HasColumnName("pass_hash");
                entity.Property(e => e.PhoneNum).HasColumnName("phone_num");
                entity.Property(e => e.ProfilePic)
                    .HasColumnType("image")
                    .HasColumnName("profile_pic");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");
                entity.Property(e => e.UserName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("user_name");
                entity.Property(e => e.UserRole).HasColumnName("user_role");

                entity.HasMany(d => d.Categories).WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "Interest",
                        r => r.HasOne<Category>().WithMany()
                            .HasForeignKey("CategoryId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("fk_category_id"),
                        l => l.HasOne<User>().WithMany()
                            .HasForeignKey("UserId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("fk_user_id"),
                        j =>
                        {
                            j.HasKey("UserId", "CategoryId").HasName("PK__interest__E4EAD9946332C8C4");
                            j.ToTable("interests");
                            j.IndexerProperty<int>("UserId").HasColumnName("user_id");
                            j.IndexerProperty<int>("CategoryId").HasColumnName("category_id");
                        });
            });

            modelBuilder.Entity<View>(entity =>
            {
                entity.HasKey(e => new { e.PostId, e.UserId }).HasName("PK__views__D54C6416E77D5D16");

                entity.ToTable("views", tb =>
                    {
                        tb.HasTrigger("num_views_trigger");
                        tb.HasTrigger("view_created_at");
                        tb.HasTrigger("views_updated_at");
                    });

                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updated_at");

                // entity.HasOne(d => d.Post).WithMany(p => p.Views)
                //     .HasForeignKey(d => d.PostId)
                //     .HasConstraintName("fk_post_id_views");

                // entity.HasOne(d => d.User).WithMany(p => p.Views)
                //     .HasForeignKey(d => d.UserId)
                //     .OnDelete(DeleteBehavior.ClientSetNull)
                //     .HasConstraintName("fk_user_id_views");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }

}