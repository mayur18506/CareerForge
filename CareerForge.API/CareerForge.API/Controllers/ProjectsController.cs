using CareerForge.API.DTOs;
using CareerForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    // CREATE PROJECT
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] ProjectDto dto)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var project = await _projectService.CreateAsync(
            userId.Value, dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = project.Id },
            project);
    }

    // GET ALL PROJECTS
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var projects = await _projectService.GetAllAsync(
            userId.Value);

        return Ok(projects);
    }

    // GET PROJECT BY ID
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var project = await _projectService.GetByIdAsync(
            id, userId.Value);

        if (project == null)
            return NotFound("Project not found.");

        return Ok(project);
    }

    // UPDATE PROJECT
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id, [FromBody] ProjectDto dto)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var project = await _projectService.UpdateAsync(
            id, userId.Value, dto);

        if (project == null)
            return NotFound("Project not found.");

        return Ok(project);
    }

    // DELETE PROJECT
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized();

        var deleted = await _projectService.DeleteAsync(
            id, userId.Value);

        if (!deleted)
            return NotFound("Project not found.");

        return NoContent();
    }

    // GET LOGGED-IN USER ID
    private int? GetUserId()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (int.TryParse(userId, out var id))
            return id;

        return null;
    }
}