namespace CareerForge.API.Models;

public class LearningGoal
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Technology { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int Progress { get; set; }

    public DateTime TargetDate { get; set; }

    public string Status { get; set; } = "In Progress";

    // Relationship with User
    public User User { get; set; } = null!;
}