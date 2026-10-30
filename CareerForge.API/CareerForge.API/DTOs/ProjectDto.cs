using System.ComponentModel.DataAnnotations;

namespace CareerForge.API.DTOs;

public class ProjectDto
{
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
}