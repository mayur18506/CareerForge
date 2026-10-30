namespace CareerForge.API.Models;

public class User
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;
    public string? PasswordResetTokenHash { get; set; }
    public DateTime? PasswordResetTokenExpiry { get; set; }

    public string Role { get; set; } = "User";

    public ICollection<LearningGoal> LearningGoals { get; set; } = new List<LearningGoal>();
}