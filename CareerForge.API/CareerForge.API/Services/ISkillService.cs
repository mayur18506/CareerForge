using CareerForge.API.DTOs;

namespace CareerForge.API.Services;

public interface ISkillService
{
    Task<SkillResponseDto> CreateSkillAsync(SkillDto skillDto);

    Task<List<SkillResponseDto>> GetSkillsAsync();

    Task<SkillResponseDto?> GetSkillByIdAsync(int id);

    Task<SkillResponseDto?> UpdateSkillAsync(int id, SkillDto skillDto);

    Task<bool> DeleteSkillAsync(int id);
}