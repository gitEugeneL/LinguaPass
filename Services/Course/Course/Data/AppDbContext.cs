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
        var languages = SeedData.GetLanguages();
        if (languages is not null)
            builder.Entity<Language>().HasData(languages);
    }
}