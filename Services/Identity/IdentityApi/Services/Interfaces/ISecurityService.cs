using IdentityApi.Domain.Entities;

namespace IdentityApi.Services.Interfaces;

public interface ISecurityService
{
    string GenerateAccessToken(User user);

    RefreshToken GenerateRefreshToken(User user);
}