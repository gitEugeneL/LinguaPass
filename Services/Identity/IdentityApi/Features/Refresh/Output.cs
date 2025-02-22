namespace IdentityApi.Features.Refresh;

public sealed record Output(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpires,
    DateTime RefreshTokenExpires,
    bool IsEmailConfirmed
);