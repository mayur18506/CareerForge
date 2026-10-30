using CareerForge.API.DTOs;
using CareerForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSkill([FromBody] SkillDto skillDto)
    {
        var skill = await _skillService.CreateSkillAsync(skillDto);

        return CreatedAtAction(
            nameof(GetSkill),
            new { id = skill.Id },
            skill);
    }

    [HttpGet]
    public async Task<IActionResult> GetSkills()
    {
        var skills = await _skillService.GetSkillsAsync();

        return Ok(skills);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSkill(int id)
    {
        var skill = await _skillService.GetSkillByIdAsync(id);

        if (skill == null)
        {
            return NotFound();
        }

        return Ok(skill);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSkill(
        int id,
        [FromBody] SkillDto skillDto)
    {
        var skill = await _skillService.UpdateSkillAsync(id, skillDto);

        if (skill == null)
        {
            return NotFound();
        }

        return Ok(skill);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSkill(int id)
    {
        var deleted = await _skillService.DeleteSkillAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}