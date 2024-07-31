namespace Domain.DTOs
{
    public class CommentWithUserDTO
    {
        public int CommentId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string ProfilePic { get; set; }
    }
}
