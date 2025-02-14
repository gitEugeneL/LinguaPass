using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace IdentityApi.Services;

internal class SecurityService(IConfiguration configuration) : ISecurityService
{
    public string GenerateAccessToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.Name),
            new("isEmailConfirmed", user.EmailConfirmed.ToString())
        };

        var settings = configuration["Authentication:AccessToken.SecurityKey"]!;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(configuration["Authentication:AccessToken.AddMin"]!)),
            SigningCredentials = credentials
        };
        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(descriptor);

        return handler.WriteToken(token);
    }

    public RefreshToken GenerateRefreshToken(User user)
    {
        return new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(265)),
            Expires = DateTime.UtcNow.AddDays(
                int.Parse(configuration["Authentication:RefreshToken.AddDays"]!)),
            User = user
        };
    }
}