using CareerForge.API.DTOs;

namespace CareerForge.API.Services;

public interface IProjectService
{
    Task<ProjectResponseDto> CreateAsync(int userId, ProjectDto dto);

    Task<List<ProjectResponseDto>> GetAllAsync(int userId);

    Task<ProjectResponseDto?> GetByIdAsync(int id, int userId);

    Task<ProjectResponseDto?> UpdateAsync(
        int id, int userId, ProjectDto dto);

    Task<bool> DeleteAsync(int id, int userId);
}