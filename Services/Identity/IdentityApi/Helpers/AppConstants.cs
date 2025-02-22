using IdentityApi.Domain.Entities;

namespace IdentityApi.Helpers;

public abstract class AppConstants
{
    public const string AdminRole = "ADMIN";
    public const string CustomerRole = "Customer";

    public static readonly Role Admin = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Name = AdminRole };

    public static readonly Role Customer = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Name = CustomerRole };
}