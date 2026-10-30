using System.ComponentModel.DataAnnotations;

namespace CareerForge.API.Models;

public class Project
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Technologies { get; set; } = string.Empty;

    [MaxLength(500)]
    public string GitHubUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string LiveDemoUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationship with User
    public User User { get; set; } = null!;
}