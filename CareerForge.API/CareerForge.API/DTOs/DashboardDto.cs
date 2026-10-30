namespace CareerForge.API.DTOs;

public class DashboardDto
{
    public int TotalSkills { get; set; }

    public int TotalLearningGoals { get; set; }

    public int CompletedLearningGoals { get; set; }

    public int TotalProjects { get; set; }

    public int TotalJobApplications { get; set; }

    public int InterviewScheduledApplications { get; set; }
}