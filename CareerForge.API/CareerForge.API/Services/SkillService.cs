using CareerForge.API.Data;
using CareerForge.API.DTOs;
using CareerForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareerForge.API.Services;

public class SkillService : ISkillService
{
    private readonly AppDbContext _context;

    public SkillService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SkillResponseDto> CreateSkillAsync(SkillDto skillDto)
    {
        var skill = new Skill
        {
            Name = skillDto.Name,
            Category = skillDto.Category,
            Level = skillDto.Level,
            Progress = skillDto.Progress
        };

        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();

        return MapToResponseDto(skill);
    }

    public async Task<List<SkillResponseDto>> GetSkillsAsync()
    {
        return await _context.Skills
            .Select(skill => new SkillResponseDto
            {
                Id = skill.Id,
                Name = skill.Name,
                Category = skill.Category,
                Level = skill.Level,
                Progress = skill.Progress
            })
            .ToListAsync();
    }

    public async Task<SkillResponseDto?> GetSkillByIdAsync(int id)
    {
        var skill = await _context.Skills
            .FirstOrDefaultAsync(skill => skill.Id == id);

        return skill == null ? null : MapToResponseDto(skill);
    }

    public async Task<SkillResponseDto?> UpdateSkillAsync(
        int id,
        SkillDto skillDto)
    {
        var skill = await _context.Skills.FindAsync(id);

        if (skill == null)
        {
            return null;
        }

        skill.Name = skillDto.Name;
        skill.Category = skillDto.Category;
        skill.Level = skillDto.Level;
        skill.Progress = skillDto.Progress;

        await _context.SaveChangesAsync();

        return MapToResponseDto(skill);
    }

    public async Task<bool> DeleteSkillAsync(int id)
    {
        var skill = await _context.Skills.FindAsync(id);

        if (skill == null)
        {
            return false;
        }

        _context.Skills.Remove(skill);
        await _context.SaveChangesAsync();

        return true;
    }

    private static SkillResponseDto MapToResponseDto(Skill skill)
    {
        return new SkillResponseDto
        {
            Id = skill.Id,
            Name = skill.Name,
            Category = skill.Category,
            Level = skill.Level,
            Progress = skill.Progress
        };
    }
}