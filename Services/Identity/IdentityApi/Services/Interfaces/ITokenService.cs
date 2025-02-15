using IdentityApi.Domain.Entities;

namespace IdentityApi.Services.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);

    RefreshToken GenerateRefreshToken(User user);
}