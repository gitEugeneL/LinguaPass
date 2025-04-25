using Account.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Account.Data.Persistence.Configs;

internal class CustomerPersonalsConfig : IEntityTypeConfiguration<CustomerPersonal>
{
    public void Configure(EntityTypeBuilder<CustomerPersonal> builder)
    {
        builder.Property(c => c.Birthday)
            .IsRequired();

        builder.Property(c => c.CountryOfBirth)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(c => c.FathersName)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.MothersName)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.Nationality)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(c => c.IdNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.CountryOfIssue)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(c => c.ContactName)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.ContactSurname)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.Relationship)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.ContactPhone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.EducationLevel)
            .IsRequired();
    }
}