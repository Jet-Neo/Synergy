using System.ComponentModel.DataAnnotations;
using System;


namespace Synergy.Models
{
    public class WorkLog
    {
        public int Id { get; set; }

        public int TaskId { get; set; }
        public int UserId { get; set; }

        [Range(0, 24)]
        public decimal HoursWorked { get; set; }

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public DateTime LogDate { get; set; } = DateTime.UtcNow;

        public TaskItem? Task { get; set; }
        public User? User { get; set; }
    }
}