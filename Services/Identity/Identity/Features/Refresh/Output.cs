using IdentityApi.Domain.Entities;

namespace IdentityApi.Features.Refresh;

public sealed record Output(
    Guid UserId,
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpires,
    DateTime RefreshTokenExpires,
    bool IsEmailConfirmed,
    Role Role
);