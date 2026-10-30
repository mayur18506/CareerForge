namespace CareerForge.API.DTOs;

public class JobApplicationResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string JobTitle { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public DateTime AppliedDate { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime? InterviewDate { get; set; }

    public string Notes { get; set; } = string.Empty;
}