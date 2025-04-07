using Course.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Course.Data.Persistence.Configs;

internal sealed class CountryConfig : IEntityTypeConfiguration<Country>
{
    public void Configure(EntityTypeBuilder<Country> builder)
    {
        builder.HasIndex(c => c.Name)
            .IsUnique();

        builder.Property(c => c.Name)
            .HasMaxLength(50);

        /*** Relations ***/
        builder.HasMany(c => c.Schools)
            .WithOne(s => s.Country)
            .HasForeignKey(s => s.CountryId);
    }
}