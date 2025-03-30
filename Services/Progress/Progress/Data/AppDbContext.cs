using Microsoft.EntityFrameworkCore;
using Progress.Domain.Entities;
using Progress.Domain.Entities.Common;

namespace Progress.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        var step = builder.Entity<Step>();
        var progress = builder.Entity<CustomerProgress>();

        step
            .HasIndex(s => s.Name)
            .IsUnique();

        step
            .HasIndex(s => s.Order)
            .IsUnique();

        progress
            .HasIndex(p => p.UserId)
            .IsUnique();

        /*** Relations ***/
        step.HasMany(s => s.CustomerProgress)
            .WithOne(p => p.Step)
            .HasForeignKey(p => p.StepId);

        /*** Seed default dev data ***/
        var steps = SeedData.GetLanguages();
        if (steps is not null)
            builder.Entity<Step>().HasData(steps);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
    }
}