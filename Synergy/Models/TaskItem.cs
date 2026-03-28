using System;
using System.ComponentModel.DataAnnotations;

namespace Synergy.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Status { get; set; } = "Pending";

        [MaxLength(50)]
        public string Priority { get; set; } = "Medium";

        public DateTime? DueDate { get; set; }

        public int? AssignedToUserId { get; set; }
        public int? TeamId { get; set; }

        // ✅ NEW FIELD (for quick frontend display)
        [MaxLength(100)]
        public string? AssigneeName { get; set; }

        public User? AssignedToUser { get; set; }
        public Team? Team { get; set; }
    }
}