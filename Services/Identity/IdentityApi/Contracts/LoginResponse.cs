using IdentityApi.Domain.Entities;

namespace IdentityApi.Contracts;

public sealed class LoginResponse(string accessToken, RefreshToken refreshToken, bool isEmailConfirmed)
{
    public string AccessToken { get; init; } = accessToken;
    public string RefreshToken { get; init; } = refreshToken.Token;
    public DateTime RefreshTokenExpires { get; init; } = refreshToken.Expires;
    public bool IsEmailConfirmed { get; init; } = isEmailConfirmed;
    public string AccessTokenType { get; init; } = "Bearer";
}