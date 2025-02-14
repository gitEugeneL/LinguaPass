using IdentityApi.Domain.Entities;

namespace IdentityApi.Helpers;

public static class Roles
{
    public static readonly Role Admin = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Name = "ADMIN" };

    public static readonly Role Customer = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Name = "CUSTOMER" };
}