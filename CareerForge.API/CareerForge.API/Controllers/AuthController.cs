using CareerForge.API.DTOs;
using CareerForge.API.Models;
using CareerForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);

        if (!result)
        {
            return Conflict("Email already registered.");
        }

        return Ok("Registration successful.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
    [FromBody] LoginDto loginDto)
    {
        var token = await _authService.LoginAsync(loginDto);

        if (token == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(new
        {
            token = token
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _authService.GetProfileAsync(
            int.Parse(userId));

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }


var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _authService.GetProfileAsync(int.Parse(userId));

        if (user == null)
        {
            return NotFound();
        }

        user.FullName = request.FullName;

        var result = await _authService.UpdateProfileAsync(user);

        if (!result)
        {
            return BadRequest(new { message = "Profile update failed." });
        }

        return Ok(new
        {
            message = "Profile updated successfully.",
            fullName = user.FullName
        });


}

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
    [FromBody] ForgotPasswordDto request)
    {
        await _authService.ForgotPasswordAsync(request.Email);

        // Do not reveal whether the email is registered.
        return Ok(new
        {
            message = "If the account exists, password reset instructions will be sent."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordDto request)
    {
        var result = await _authService.ResetPasswordAsync(
            request.Email,
            request.Token,
            request.NewPassword);

        if (!result)
        {
            return BadRequest(new
            {
                message = "The reset link is invalid or expired."
            });
        }

        return Ok(new
        {
            message = "Password reset successfully."
        });
    }

}