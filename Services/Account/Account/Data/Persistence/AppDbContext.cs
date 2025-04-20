using System.Reflection;
using Account.Domain.Entities;
using Account.Domain.Entities.Common;
using Microsoft.EntityFrameworkCore;

namespace Account.Data.Persistence;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<CustomerAccount> CustomerAccounts { get; init; }
    public required DbSet<CustomerContact> CustomerContacts { get; init; }
    public required DbSet<Address> Addresses { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        /*** Add database configurations ***/
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
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