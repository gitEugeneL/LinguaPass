using Course.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Course.Data.Persistence.Configs;

internal sealed class LanguageConfig : IEntityTypeConfiguration<Language>
{
    public void Configure(EntityTypeBuilder<Language> builder)
    {
        builder.HasIndex(l => l.Name)
            .IsUnique();

        builder.Property(l => l.Name)
            .HasMaxLength(50);

        builder.Property(l => l.Description)
            .HasMaxLength(100);

        /*** Relations ***/
        builder.HasMany(l => l.Tracks)
            .WithOne(t => t.Language)
            .HasForeignKey(t => t.LanguageId);

        builder.HasMany(l => l.Schools)
            .WithMany(s => s.Languages);
    }
}