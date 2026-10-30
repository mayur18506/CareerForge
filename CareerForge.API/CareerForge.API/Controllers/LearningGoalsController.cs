using CareerForge.API.DTOs;
using CareerForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LearningGoalsController : ControllerBase
{
    private readonly ILearningGoalService _learningGoalService;

    public LearningGoalsController(
        ILearningGoalService learningGoalService)
    {
        _learningGoalService = learningGoalService;
    }

    // CREATE
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] LearningGoalDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        if (dto.Progress < 0 || dto.Progress > 100)
            return BadRequest("Progress must be between 0 and 100.");

        var goal = await _learningGoalService.CreateAsync(
            userId.Value, dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = goal.Id },
            goal);
    }

    // GET ALL
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var goals = await _learningGoalService.GetAllAsync(
            userId.Value);

        return Ok(goals);
    }

    // GET BY ID
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var goal = await _learningGoalService.GetByIdAsync(
            id, userId.Value);

        if (goal == null)
            return NotFound("Learning goal not found.");

        return Ok(goal);
    }

    // UPDATE
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id, [FromBody] LearningGoalDto dto)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        if (dto.Progress < 0 || dto.Progress > 100)
            return BadRequest("Progress must be between 0 and 100.");

        var goal = await _learningGoalService.UpdateAsync(
            id, userId.Value, dto);

        if (goal == null)
            return NotFound("Learning goal not found.");

        return Ok(goal);
    }

    // DELETE
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var deleted = await _learningGoalService.DeleteAsync(
            id, userId.Value);

        if (!deleted)
            return NotFound("Learning goal not found.");

        return NoContent();
    }

    private int? GetUserId()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (int.TryParse(userId, out var id))
            return id;

        return null;
    }
}