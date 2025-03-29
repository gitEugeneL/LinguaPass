using IdentityApi.Domain.Entities;

namespace IdentityApi.Tools;

public abstract class Constants
{
    public static readonly Role Admin = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Name = AuthConfig.Tools.Constants.AdminRole };

    public static readonly Role Customer = new()
        { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Name = AuthConfig.Tools.Constants.CustomerRole };
}