using System.Reflection;
using Course.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Course.Data.Persistence;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Language> Languages { get; init; }
    public required DbSet<Country> Countries { get; init; }
    public required DbSet<School> Schools { get; init; }
    public required DbSet<Track> Tracks { get; init; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        /*** Add database configurations ***/
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }
}