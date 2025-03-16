using Course.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Course.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Language> Languages { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Language>()
            .HasIndex(l => l.Name)
            .IsUnique();

        builder.Entity<Language>()
            .Property(l => l.Description)
            .HasMaxLength(120);

        /*** Relations ***/

        /*** Seed default dev data ***/
        builder.Entity<Language>().HasData(
            new Language
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "English",
                Description = "Some text about English courses",
                IsActive = true
            });
    }
}