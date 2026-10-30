using CareerForge.API.Data;
using CareerForge.API.DTOs;
using CareerForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareerForge.API.Services;

public class LearningGoalService : ILearningGoalService
{
    private readonly AppDbContext _context;

    public LearningGoalService(AppDbContext context)
    {
        _context = context;
    }

    // CREATE
    public async Task<LearningGoalResponseDto> CreateAsync(
        int userId, LearningGoalDto dto)
    {
        var goal = new LearningGoal
        {
            UserId = userId,
            Title = dto.Title,
            Technology = dto.Technology,
            Description = dto.Description,
            Progress = dto.Progress,
            TargetDate = dto.TargetDate,
            Status = dto.Status
        };

        _context.LearningGoals.Add(goal);
        await _context.SaveChangesAsync();

        return MapToDto(goal);
    }

    // READ ALL
    public async Task<List<LearningGoalResponseDto>> GetAllAsync(
        int userId)
    {
        var goals = await _context.LearningGoals
            .AsNoTracking()
            .Where(g => g.UserId == userId)
            .ToListAsync();

        return goals.Select(MapToDto).ToList();
    }

    // READ BY ID
    public async Task<LearningGoalResponseDto?> GetByIdAsync(
        int id, int userId)
    {
        var goal = await _context.LearningGoals
            .AsNoTracking()
            .FirstOrDefaultAsync(g =>
                g.Id == id && g.UserId == userId);

        return goal == null ? null : MapToDto(goal);
    }

    // UPDATE
    public async Task<LearningGoalResponseDto?> UpdateAsync(
        int id, int userId, LearningGoalDto dto)
    {
        var goal = await _context.LearningGoals
            .FirstOrDefaultAsync(g =>
                g.Id == id && g.UserId == userId);

        if (goal == null)
        {
            return null;
        }

        goal.Title = dto.Title;
        goal.Technology = dto.Technology;
        goal.Description = dto.Description;
        goal.Progress = dto.Progress;
        goal.TargetDate = dto.TargetDate;
        goal.Status = dto.Status;

        await _context.SaveChangesAsync();

        return MapToDto(goal);
    }

    // DELETE
    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var goal = await _context.LearningGoals
            .FirstOrDefaultAsync(g =>
                g.Id == id && g.UserId == userId);

        if (goal == null)
        {
            return false;
        }

        _context.LearningGoals.Remove(goal);
        await _context.SaveChangesAsync();

        return true;
    }

    // ENTITY TO DTO MAPPING
    private static LearningGoalResponseDto MapToDto(
        LearningGoal goal)
    {
        return new LearningGoalResponseDto
        {
            Id = goal.Id,
            UserId = goal.UserId,
            Title = goal.Title,
            Technology = goal.Technology,
            Description = goal.Description,
            Progress = goal.Progress,
            TargetDate = goal.TargetDate,
            Status = goal.Status
        };
    }
}