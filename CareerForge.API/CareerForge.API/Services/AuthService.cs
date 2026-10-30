using CareerForge.API.Data;
using CareerForge.API.DTOs;
using CareerForge.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CareerForge.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;
    public AuthService(
     AppDbContext context,
     IConfiguration configuration,
     EmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<bool> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _context.Users
            .AnyAsync(u => u.Email == registerDto.Email);

        if (existingUser)
        {
            return false;
        }

        var user = new User
        {
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                registerDto.Password),
            Role = "User"
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<string?> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            return null;
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            loginDto.Password,
            user.PasswordHash);

        if (!passwordValid)
        {
            return null;
        }

        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT key is not configured.");

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new Claim(
                ClaimTypes.Name,
                user.FullName),

            new Claim(
                ClaimTypes.Email,
                user.Email),

            new Claim(
                ClaimTypes.Role,
                user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(
                    _configuration["Jwt:ExpiryMinutes"])),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
    public async Task<UserProfileDto?> GetProfileAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return null;
        }

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<bool> UpdateProfileAsync(UserProfileDto user)
    {
        var existingUser = await _context.Users
        .FirstOrDefaultAsync(u => u.Id == user.Id);


if (existingUser == null)
        {
            return false;
        }

        existingUser.FullName = user.FullName;

        await _context.SaveChangesAsync();

        return true;


    }
   

public async Task<bool> ForgotPasswordAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
            return false;

        var resetToken = Convert.ToBase64String(
            System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));

        user.PasswordResetTokenHash = Convert.ToHexString(
            System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(resetToken)));

        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);

        await _context.SaveChangesAsync();

        var resetLink =
            $"http://localhost:5173/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(resetToken)}";

        var subject = "CareerForge - Reset Your Password";

        var body = $"""
        Hello {user.FullName},

        We received a request to reset your CareerForge password.

        Use the following link to reset your password:

        {resetLink}

        This link expires in 15 minutes.

        If you did not request this, please ignore this email.
        """;

        await _emailService.SendEmailAsync(
            user.Email,
            subject,
            body);

        return true;
    }



    public async Task<bool> ResetPasswordAsync(
        string email,
        string token,
        string newPassword)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null ||
            string.IsNullOrEmpty(user.PasswordResetTokenHash) ||
            user.PasswordResetTokenExpiry == null ||
            user.PasswordResetTokenExpiry < DateTime.UtcNow)
        {
            return false;
        }

        var tokenHash = Convert.ToHexString(
            System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(token)));

        if (!System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(
            Convert.FromHexString(tokenHash),
            Convert.FromHexString(user.PasswordResetTokenHash)))
        {
            return false;
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordResetTokenHash = null;
        user.PasswordResetTokenExpiry = null;

        await _context.SaveChangesAsync();

        return true;
    }

}