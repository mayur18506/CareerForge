using System.ComponentModel.DataAnnotations;

namespace CareerForge.API.Models
{
    public class UpdateProfileRequest
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
    }
}
