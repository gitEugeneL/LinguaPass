using Account.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Account.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<CustomerAccount> CustomerAccounts { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<CustomerAccount>()
            .HasIndex(a => a.UserId)
            .IsUnique();

        builder.Entity<CustomerAccount>()
            .Property(a => a.UpdatedAt)
            .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'"); // PostgreSQL syntax
    }
}