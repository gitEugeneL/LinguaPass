using Account.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Account.Data.Persistence.Configs;

internal sealed class CustomerAccountConfig : IEntityTypeConfiguration<CustomerAccount>
{
    public void Configure(EntityTypeBuilder<CustomerAccount> builder)
    {
        builder.HasIndex(a => a.UserId)
            .IsUnique();

        /*** Relations ***/
        builder.HasOne(a => a.Contact);
    }
}