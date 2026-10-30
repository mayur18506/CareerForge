using System.ComponentModel.DataAnnotations;

namespace CareerForge.API.Models;

public class JobApplication
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required]
    [MaxLength(150)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string JobTitle { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Location { get; set; } = string.Empty;

    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string Status { get; set; } = "Applied";

    public DateTime? InterviewDate { get; set; }

    public string Notes { get; set; } = string.Empty;

    public User User { get; set; } = null!;
}