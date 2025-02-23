using IdentityApi.Domain.Entities;

namespace IdentityApi.Services.Interfaces;

public interface ISecurityService
{
    bool RefreshTokenIsExpired(RefreshToken refreshToken);

    (string token, DateTime expires) GenerateAccessToken(User user);

    (string token, DateTime expires) GenerateRefreshToken(User user);

    void UpdateRefreshToken(User user);

    (string code, DateTime expires) GenerateCode(User user);
}