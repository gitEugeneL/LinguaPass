using IdentityApi.Domain.Entities;
using IdentityApi.Helpers;

namespace IdentityApi.Tests;

public static class TestExtensions
{
    public static User GetFakeUser(string code, DateTime expires)
    {
        return new User
        {
            Email = "user@user.com",
            Age = 20,
            PwdHash = [],
            PwdSalt = [],
            Role = AppConstants.Customer,
            ConfirmationCode = new ConfirmationCode
            {
                Code = code,
                Expires = expires
            }
        };
    }
}