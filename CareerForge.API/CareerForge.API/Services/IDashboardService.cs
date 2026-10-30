using CareerForge.API.DTOs;

namespace CareerForge.API.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(int userId);
}