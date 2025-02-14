using IdentityApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<User> Users { get; init; }
    public required DbSet<Role> Roles { get; init; }
    public required DbSet<RefreshToken> RefreshTokens { get; init; }
    public required DbSet<ConfirmationCode> ConfirmationCodes { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        builder.Entity<User>()
            .Property(u => u.Email)
            .HasMaxLength(250);

        /*** Relations ***/

        builder.Entity<User>()
            .HasMany(u => u.RefreshTokens)
            .WithOne(rt => rt.User)
            .HasForeignKey(rt => rt.UserId);

        builder.Entity<Role>()
            .HasMany(r => r.Users)
            .WithOne(u => u.Role)
            .HasForeignKey(u => u.RoleId);

        builder.Entity<ConfirmationCode>()
            .HasOne(cc => cc.User)
            .WithOne(u => u.ConfirmationCode);

        /*** Seed default data ***/

        builder.Entity<Role>().HasData(
            Helpers.Roles.Admin,
            Helpers.Roles.Customer
        );
    }
}