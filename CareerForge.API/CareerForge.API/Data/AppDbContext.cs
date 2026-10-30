using CareerForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareerForge.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Skill> Skills { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<LearningGoal> LearningGoals { get; set; }

    public DbSet<Project> Projects { get; set; }

    public DbSet<JobApplication> JobApplications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<LearningGoal>()
            .HasOne(lg => lg.User)
            .WithMany(u => u.LearningGoals)
            .HasForeignKey(lg => lg.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Project>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobApplication>()
            .HasOne(j => j.User)
            .WithMany()
            .HasForeignKey(j => j.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}