namespace CareerForge.API.DTOs;

public class LearningGoalResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Technology { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int Progress { get; set; }

    public DateTime TargetDate { get; set; }

    public string Status { get; set; } = string.Empty;
}