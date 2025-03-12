namespace IdentityApi.Features.Login;

public sealed record Output(
    Guid UserId,
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpires,
    DateTime RefreshTokenExpires,
    bool IsEmailConfirmed
);