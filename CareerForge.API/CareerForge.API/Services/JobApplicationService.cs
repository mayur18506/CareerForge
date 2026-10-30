using CareerForge.API.Data;
using CareerForge.API.DTOs;
using CareerForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareerForge.API.Services;

public class JobApplicationService : IJobApplicationService
{
    private readonly AppDbContext _context;

    public JobApplicationService(AppDbContext context)
    {
        _context = context;
    }

    // CREATE
    public async Task<JobApplicationResponseDto> CreateAsync(
        int userId, JobApplicationDto dto)
    {
        var application = new JobApplication
        {
            UserId = userId,
            CompanyName = dto.CompanyName,
            JobTitle = dto.JobTitle,
            Location = dto.Location,
            AppliedDate = dto.AppliedDate,
            Status = dto.Status,
            InterviewDate = dto.InterviewDate,
            Notes = dto.Notes
        };

        _context.JobApplications.Add(application);

        await _context.SaveChangesAsync();

        return MapToDto(application);
    }

    // GET ALL
    public async Task<List<JobApplicationResponseDto>> GetAllAsync(
        int userId)
    {
        var applications = await _context.JobApplications
            .AsNoTracking()
            .Where(j => j.UserId == userId)
            .ToListAsync();

        return applications.Select(MapToDto).ToList();
    }

    // GET BY ID
    public async Task<JobApplicationResponseDto?> GetByIdAsync(
        int id, int userId)
    {
        var application = await _context.JobApplications
            .AsNoTracking()
            .FirstOrDefaultAsync(j =>
                j.Id == id && j.UserId == userId);

        return application == null
            ? null
            : MapToDto(application);
    }

    // UPDATE
    public async Task<JobApplicationResponseDto?> UpdateAsync(
        int id, int userId, JobApplicationDto dto)
    {
        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j =>
                j.Id == id && j.UserId == userId);

        if (application == null)
            return null;

        application.CompanyName = dto.CompanyName;
        application.JobTitle = dto.JobTitle;
        application.Location = dto.Location;
        application.AppliedDate = dto.AppliedDate;
        application.Status = dto.Status;
        application.InterviewDate = dto.InterviewDate;
        application.Notes = dto.Notes;

        await _context.SaveChangesAsync();

        return MapToDto(application);
    }

    // DELETE
    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j =>
                j.Id == id && j.UserId == userId);

        if (application == null)
            return false;

        _context.JobApplications.Remove(application);

        await _context.SaveChangesAsync();

        return true;
    }

    // MAP ENTITY TO DTO
    private static JobApplicationResponseDto MapToDto(
        JobApplication application)
    {
        return new JobApplicationResponseDto
        {
            Id = application.Id,
            UserId = application.UserId,
            CompanyName = application.CompanyName,
            JobTitle = application.JobTitle,
            Location = application.Location,
            AppliedDate = application.AppliedDate,
            Status = application.Status,
            InterviewDate = application.InterviewDate,
            Notes = application.Notes
        };
    }
}