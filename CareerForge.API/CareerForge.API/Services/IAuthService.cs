using CareerForge.API.DTOs;

namespace CareerForge.API.Services;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterDto registerDto);

    Task<string?> LoginAsync(LoginDto loginDto);

    Task<UserProfileDto?> GetProfileAsync(int userId);

    Task<bool> UpdateProfileAsync(UserProfileDto user);

    Task<bool> ForgotPasswordAsync(string email);

    Task<bool> ResetPasswordAsync(
        string email,
        string token,
        string newPassword);
}