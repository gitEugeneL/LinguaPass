using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using Microsoft.Extensions.Configuration;

namespace IdentityApi.IntegrationTests.FakeServices;

public class FakeConfirmationService(IConfiguration configuration) : IConfirmationService
{
    public const char ValidCodeChar = '1';

    public (string code, DateTime expires) GenerateCode()
    {
        var expires = DateTime.UtcNow.AddMinutes(int.Parse(configuration["Authentication:Code.Lifetime.Minutes"]!));
        var codeLength = int.Parse(configuration["Authentication:Code.Length"]!);

        var code = new string(Enumerable.Repeat(ValidCodeChar, codeLength).ToArray());

        return (code, expires);
    }

    public bool IsCodeValid(User user, string code)
    {
        return user.ConfirmationCode is not null
               && user.ConfirmationCode.Code == code && user.ConfirmationCode.Expires >= DateTime.UtcNow;
    }
}