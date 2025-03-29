using IdentityApi.Domain.Entities;
using IdentityApi.Tools;

namespace IdentityApi.Tests;

public static class TestExtensions
{
    public static User GetFakeUser(string code, DateTime expires)
    {
        return new User
        {
            Email = "user@user.com",
            PwdHash = [],
            PwdSalt = [],
            Role = Constants.Customer,
            ConfirmationCode = new ConfirmationCode
            {
                Code = code,
                Expires = expires
            }
        };
    }
}