namespace IdentityApi.Contracts;

public sealed class LoginOrRefreshResponse(
    string accessToken,
    string refreshToken,
    DateTime accessTokenExpires,
    DateTime refreshTokenExpires,
    bool isEmailConfirmed)
{
    public string AccessToken { get; init; } = accessToken;
    public string RefreshToken { get; init; } = refreshToken;
    public DateTime AccessTokenExpires { get; init; } = accessTokenExpires;
    public DateTime RefreshTokenExpires { get; init; } = refreshTokenExpires;
    public bool IsEmailConfirmed { get; init; } = isEmailConfirmed;
    public string AccessTokenType { get; init; } = "Bearer";
}