using CareerForge.API.DTOs;
using CareerForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerForge.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class JobApplicationsController : ControllerBase
{
    private readonly IJobApplicationService _service;

    public JobApplicationsController(IJobApplicationService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );
    }

    // GET: api/JobApplications
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var applications = await _service.GetAllAsync(GetUserId());
        return Ok(applications);
    }

    // GET: api/JobApplications/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var application = await _service.GetByIdAsync(
            id, GetUserId());

        if (application == null)
            return NotFound(new { message = "Job application not found." });

        return Ok(application);
    }

    // POST: api/JobApplications
    [HttpPost]
    public async Task<IActionResult> Create(JobApplicationDto dto)
    {
        var application = await _service.CreateAsync(
            GetUserId(), dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = application.Id },
            application);
    }

    // PUT: api/JobApplications/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id, JobApplicationDto dto)
    {
        var application = await _service.UpdateAsync(
            id, GetUserId(), dto);

        if (application == null)
            return NotFound(new { message = "Job application not found." });

        return Ok(application);
    }

    // DELETE: api/JobApplications/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(
            id, GetUserId());

        if (!deleted)
            return NotFound(new { message = "Job application not found." });

        return NoContent();
    }
}