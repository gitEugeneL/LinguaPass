using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace IdentityApi.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    public (string token, DateTime expires) GenerateAccessToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.Name),
            new("isEmailConfirmed", user.EmailConfirmed.ToString())
        };

        var settings = configuration["Authentication:AccessToken.SecurityKey"]!;
        var expires =
            DateTime.UtcNow.AddMinutes(int.Parse(configuration["Authentication:AccessToken.Lifetime.Minutes"]!));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            SigningCredentials = credentials,
            Issuer = configuration["Authentication:Issuer"],
            Audience = configuration["Authentication:Audience"]
        };
        var handler = new JwtSecurityTokenHandler();
        var token = handler.WriteToken(handler.CreateToken(descriptor));

        return (token, expires);
    }

    public (string token, DateTime expires) GenerateRefreshToken(User user)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(265));
        var expires = DateTime.UtcNow.AddDays(
            int.Parse(configuration["Authentication:RefreshToken.Lifetime.Days"]!));

        return (token, expires);
    }

    public bool IsRefreshTokenActive(RefreshToken refreshToken)
    {
        return refreshToken.Expires >= DateTime.UtcNow;
    }

    public void UpdateRefreshToken(User user)
    {
        var maxCount = int.Parse(configuration["Authentication:RefreshToken.MaxCount"]!);
        if (user.RefreshTokens.Count >= maxCount)
            user.RefreshTokens.Remove(user.RefreshTokens.OrderBy(rt => rt.Expires).First());
    }
}