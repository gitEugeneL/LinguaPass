using Account.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Account.Data.Persistence.Configs;

internal class CustomerContactConfig : IEntityTypeConfiguration<CustomerContact>
{
    public void Configure(EntityTypeBuilder<CustomerContact> builder)
    {
        builder.Property(c => c.Name)
            .HasMaxLength(20);

        builder.Property(c => c.Surname)
            .HasMaxLength(50);

        builder.Property(c => c.Phone)
            .HasMaxLength(20);

        builder.Property(c => c.MiddleName)
            .HasMaxLength(20);

        builder.Property(c => c.MaidenName)
            .HasMaxLength(20);

        /*** Relations ***/
        builder.HasOne(c => c.Address)
            .WithMany(a => a.Contacts)
            .HasForeignKey(c => c.AddressId);
    }
}