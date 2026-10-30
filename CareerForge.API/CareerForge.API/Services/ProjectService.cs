using CareerForge.API.Data;
using CareerForge.API.DTOs;
using CareerForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareerForge.API.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    // CREATE
    public async Task<ProjectResponseDto> CreateAsync(
        int userId, ProjectDto dto)
    {
        var project = new Project
        {
            UserId = userId,
            Title = dto.Title,
            Description = dto.Description,
            Technologies = dto.Technologies,
            GitHubUrl = dto.GitHubUrl,
            LiveDemoUrl = dto.LiveDemoUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return MapToDto(project);
    }

    // GET ALL
    public async Task<List<ProjectResponseDto>> GetAllAsync(
        int userId)
    {
        var projects = await _context.Projects
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return projects.Select(MapToDto).ToList();
    }

    // GET BY ID
    public async Task<ProjectResponseDto?> GetByIdAsync(
        int id, int userId)
    {
        var project = await _context.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(p =>
                p.Id == id && p.UserId == userId);

        return project == null ? null : MapToDto(project);
    }

    // UPDATE
    public async Task<ProjectResponseDto?> UpdateAsync(
        int id, int userId, ProjectDto dto)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p =>
                p.Id == id && p.UserId == userId);

        if (project == null)
            return null;

        project.Title = dto.Title;
        project.Description = dto.Description;
        project.Technologies = dto.Technologies;
        project.GitHubUrl = dto.GitHubUrl;
        project.LiveDemoUrl = dto.LiveDemoUrl;

        await _context.SaveChangesAsync();

        return MapToDto(project);
    }

    // DELETE
    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p =>
                p.Id == id && p.UserId == userId);

        if (project == null)
            return false;

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return true;
    }

    // MAP ENTITY TO DTO
    private static ProjectResponseDto MapToDto(Project project)
    {
        return new ProjectResponseDto
        {
            Id = project.Id,
            UserId = project.UserId,
            Title = project.Title,
            Description = project.Description,
            Technologies = project.Technologies,
            GitHubUrl = project.GitHubUrl,
            LiveDemoUrl = project.LiveDemoUrl,
            CreatedAt = project.CreatedAt
        };
    }
}