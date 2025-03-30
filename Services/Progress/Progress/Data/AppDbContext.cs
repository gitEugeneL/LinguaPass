using Microsoft.EntityFrameworkCore;
using Progress.Domain.Entities;
using Progress.Domain.Entities.Common;

namespace Progress.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<CustomerProgress> CustomerProgress { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<CustomerProgress>()
            .HasIndex(p => p.UserId)
            .IsUnique();
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