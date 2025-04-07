using Course.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Course.Data.Persistence.Configs;

internal sealed class SchoolConfig : IEntityTypeConfiguration<School>
{
    public void Configure(EntityTypeBuilder<School> builder)
    {
        builder.HasIndex(s => s.Name)
            .IsUnique();

        builder.HasIndex(s => s.ShortName)
            .IsUnique();

        builder.Property(s => s.ShortName)
            .HasMaxLength(50);

        builder.Property(c => c.Name)
            .HasMaxLength(100);

        builder.Property(c => c.City)
            .HasMaxLength(50);

        /*** Relations ***/
        builder.HasOne(s => s.Country)
            .WithMany(c => c.Schools)
            .HasForeignKey(c => c.CountryId);

        builder.HasMany(s => s.Languages)
            .WithMany(l => l.Schools);

        builder.HasMany(s => s.Tracks)
            .WithOne(t => t.School)
            .HasForeignKey(t => t.SchoolId);
    }
}