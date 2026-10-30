using System.ComponentModel.DataAnnotations;

namespace CareerForge.API.DTOs;

public class LearningGoalDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Technology { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Range(0, 100)]
    public int Progress { get; set; }

    public DateTime TargetDate { get; set; }

    public string Status { get; set; } = "In Progress";
}