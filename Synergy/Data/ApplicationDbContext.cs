using Microsoft.EntityFrameworkCore;
using Synergy.Models;

namespace Synergy.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Team> Teams => Set<Team>();
        public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
        public DbSet<WorkLog> WorkLogs => Set<WorkLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Team>().ToTable("teams");
            modelBuilder.Entity<TeamMember>().ToTable("team_members");
            modelBuilder.Entity<TaskItem>().ToTable("tasks");
            modelBuilder.Entity<WorkLog>().ToTable("work_logs");

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.User)
                .WithMany()
                .HasForeignKey(tm => tm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.Team)
                .WithMany()
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.AssignedToUser)
                .WithMany()
                .HasForeignKey(t => t.AssignedToUserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Team)
                .WithMany()
                .HasForeignKey(t => t.TeamId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<WorkLog>()
                .HasOne(w => w.Task)
                .WithMany()
                .HasForeignKey(w => w.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkLog>()
                .HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}