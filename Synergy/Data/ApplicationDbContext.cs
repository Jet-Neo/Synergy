using Microsoft.EntityFrameworkCore;
using Synergy.Models;
using System.Collections.Generic;

namespace Synergy.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }
    }
}