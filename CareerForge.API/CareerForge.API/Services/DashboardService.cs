using CareerForge.API.Data;
using CareerForge.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CareerForge.API.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> GetDashboardAsync(int userId)
    {
        var totalSkills = await _context.Skills.CountAsync();

        var totalLearningGoals = await _context.LearningGoals
            .CountAsync(g => g.UserId == userId);

        var completedLearningGoals = await _context.LearningGoals
            .CountAsync(g =>
                g.UserId == userId &&
                g.Status == "Completed");

        var totalProjects = await _context.Projects
            .CountAsync(p => p.UserId == userId);

        var totalJobApplications = await _context.JobApplications
            .CountAsync(j => j.UserId == userId);

        var interviewScheduledApplications =
            await _context.JobApplications.CountAsync(j =>
                j.UserId == userId &&
                j.Status == "Interview Scheduled");

        return new DashboardDto
        {
            TotalSkills = totalSkills,
            TotalLearningGoals = totalLearningGoals,
            CompletedLearningGoals = completedLearningGoals,
            TotalProjects = totalProjects,
            TotalJobApplications = totalJobApplications,
            InterviewScheduledApplications =
                interviewScheduledApplications
        };
    }
}