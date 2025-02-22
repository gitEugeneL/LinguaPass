using IdentityApi.Domain.Entities;

namespace IdentityApi.Services.Interfaces;

public interface ISecurityService
{
    bool RefreshTokenIsExpired(RefreshToken refreshToken);

    (string token, DateTime expires) GenerateAccessToken(User user);

    RefreshToken GenerateRefreshToken(User user); // todo переделать

    (string code, DateTime expires) GenerateCode(User user);
}