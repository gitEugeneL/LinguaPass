using Course.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Course.Data.Persistence.Configs;

internal sealed class TrackConfig : IEntityTypeConfiguration<Track>
{
    public void Configure(EntityTypeBuilder<Track> builder)
    {
        builder.Property(t => t.Name)
            .HasMaxLength(50);

        builder.Property(t => t.Description)
            .HasMaxLength(300);

        builder.Property(t => t.Duration)
            .HasMaxLength(50);

        builder.Property(t => t.Activities)
            .HasMaxLength(200);

        builder.Property(t => t.Price)
            .HasColumnType("NUMERIC(7, 2)");

        builder.Property(t => t.AdmissionFee)
            .HasColumnType("NUMERIC(7, 2)");

        /*** Relations ***/
        builder.HasOne(t => t.Language)
            .WithMany(l => l.Tracks)
            .HasForeignKey(t => t.LanguageId);

        builder.HasOne(t => t.School)
            .WithMany(s => s.Tracks)
            .HasForeignKey(t => t.SchoolId);
    }
}