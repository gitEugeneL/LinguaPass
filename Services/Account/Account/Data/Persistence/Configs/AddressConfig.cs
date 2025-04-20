using Account.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Account.Data.Persistence.Configs;

internal sealed class AddressConfig : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.Property(a => a.Street)
            .HasMaxLength(50);

        builder.Property(a => a.CorrStreet)
            .HasMaxLength(50);

        builder.Property(a => a.HsApt)
            .HasMaxLength(10);

        builder.Property(a => a.CorrHsApt)
            .HasMaxLength(10);

        builder.Property(a => a.City)
            .HasMaxLength(30);

        builder.Property(a => a.CorrCity)
            .HasMaxLength(30);

        builder.Property(a => a.Country)
            .HasMaxLength(30);

        builder.Property(a => a.CorrCountry)
            .HasMaxLength(30);

        builder.Property(a => a.Postcode)
            .HasMaxLength(10);

        builder.Property(a => a.CorrPostcode)
            .HasMaxLength(10);

        /*** Relations ***/
        builder.HasMany(a => a.Contacts)
            .WithOne(c => c.Address)
            .HasForeignKey(c => c.AddressId);
    }
}