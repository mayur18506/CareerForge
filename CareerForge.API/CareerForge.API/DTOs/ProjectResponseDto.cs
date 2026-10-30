namespace CareerForge.API.DTOs;

public class ProjectResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Technologies { get; set; } = string.Empty;

    public string GitHubUrl { get; set; } = string.Empty;

    public string LiveDemoUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}