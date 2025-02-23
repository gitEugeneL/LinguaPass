using IdentityApi.Domain.Entities;

namespace IdentityApi.Services.Interfaces;

public interface ISecurityService
{
    (string token, DateTime expires) GenerateAccessToken(User user);

    (string token, DateTime expires) GenerateRefreshToken(User user);

    (string code, DateTime expires) GenerateCode(User user);

    void UpdateRefreshToken(User user);

    bool IsRefreshTokenExpired(RefreshToken refreshToken);

    bool IsCodeValid(User user, string code);
}