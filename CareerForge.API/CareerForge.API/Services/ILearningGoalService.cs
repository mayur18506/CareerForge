using CareerForge.API.DTOs;

namespace CareerForge.API.Services;

public interface ILearningGoalService
{
    Task<LearningGoalResponseDto> CreateAsync(
        int userId, LearningGoalDto dto);

    Task<List<LearningGoalResponseDto>> GetAllAsync(int userId);

    Task<LearningGoalResponseDto?> GetByIdAsync(
        int id, int userId);

    Task<LearningGoalResponseDto?> UpdateAsync(
        int id, int userId, LearningGoalDto dto);

    Task<bool> DeleteAsync(int id, int userId);
}