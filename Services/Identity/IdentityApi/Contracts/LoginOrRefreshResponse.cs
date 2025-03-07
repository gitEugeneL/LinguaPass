namespace IdentityApi.Contracts;

public sealed class LoginOrRefreshResponse(
    Guid userId,
    string accessToken,
    DateTime accessTokenExpires,
    DateTime refreshTokenExpires,
    bool isEmailConfirmed)
{
    public Guid UserId { get; init; } = userId;
    public string AccessToken { get; init; } = accessToken;
    public DateTime AccessTokenExpires { get; init; } = accessTokenExpires;
    public DateTime RefreshTokenExpires { get; init; } = refreshTokenExpires;
    public bool IsEmailConfirmed { get; init; } = isEmailConfirmed;
    public string AccessTokenType { get; init; } = "Bearer";
}