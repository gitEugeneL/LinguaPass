using IdentityApi.Domain.Entities;

namespace IdentityApi.Utils;

public abstract class Constants
{
    private const string AdminRole = "ADMIN";
    private const string CustomerRole = "CUSTOMER";

    public static readonly Role Admin = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Name = AdminRole };

    public static readonly Role Customer = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Name = CustomerRole };
}