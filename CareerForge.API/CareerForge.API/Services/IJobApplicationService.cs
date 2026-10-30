using CareerForge.API.DTOs;

namespace CareerForge.API.Services;

public interface IJobApplicationService
{
    Task<JobApplicationResponseDto> CreateAsync(
        int userId, JobApplicationDto dto);

    Task<List<JobApplicationResponseDto>> GetAllAsync(
        int userId);

    Task<JobApplicationResponseDto?> GetByIdAsync(
        int id, int userId);

    Task<JobApplicationResponseDto?> UpdateAsync(
        int id, int userId, JobApplicationDto dto);

    Task<bool> DeleteAsync(int id, int userId);
}