using FluentAssertions;
using IdentityApi.Domain.Entities;
using IdentityApi.Services;
using Microsoft.Extensions.Configuration;

namespace IdentityApi.Tests.Services;

public class TokenServiceTests
{
    private const int AccessTokenLifeTimeMinutes = 10;
    private const int RefreshTokenLifeTimeDays = 30;
    private const int RefreshTokenMaxCount = 5;

    private readonly IConfiguration _configuration;

    public TokenServiceTests()
    {
        var configurationSettings = new Dictionary<string, string?>
        {
            {
                "Authentication:AccessToken.SecurityKey",
                "OnlyDevSecurityKey123456789_DONT_USE_DONT_USE_DONT_USE_DONT_USE_!!"
            },
            { "Authentication:AccessToken.Lifetime.Minutes", AccessTokenLifeTimeMinutes.ToString() },
            { "Authentication:RefreshToken.Lifetime.Days", RefreshTokenLifeTimeDays.ToString() },
            { "Authentication:RefreshToken.MaxCount", RefreshTokenMaxCount.ToString() },
            { "Authentication:Issuer", "TestIssuer" },
            { "Authentication:Audience", "TestAudience" }
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configurationSettings)
            .Build();
    }

    [Fact]
    public void GenerateAccessToken_WithValidData_ReturnsValidAccessToken()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);

        // Act
        var (token, expires) = tokenService.GenerateAccessToken(user);

        // Assert
        token.Should().NotBeEmpty();
        expires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(AccessTokenLifeTimeMinutes), TimeSpan.FromSeconds(3));
    }

    [Fact]
    public void GenerateRefreshToken_WithValidData_ReturnsValidRefreshToken()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);

        // Act
        var (token, expires) = tokenService.GenerateRefreshToken(user);

        // Assert
        token.Should().NotBeEmpty();
        expires.Should()
            .BeCloseTo(DateTime.UtcNow.AddDays(RefreshTokenLifeTimeDays), TimeSpan.FromSeconds(3));
    }

    [Fact]
    public void IsRefreshTokenActive_WithExpiredRefreshToken_ReturnsFalse()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var refreshToken = new RefreshToken
        {
            Expires = DateTime.MinValue,
            Token = "valid-token",
            User = TestExtensions.GetFakeUser("-1", DateTime.UtcNow)
        };

        // Act
        var result = tokenService.IsRefreshTokenActive(refreshToken);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void IsRefreshTokenActive_WithNotExpiredRefreshToken_ReturnsTrue()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var refreshToken = new RefreshToken
        {
            Expires = DateTime.UtcNow.AddDays(RefreshTokenLifeTimeDays),
            Token = "valid-token",
            User = TestExtensions.GetFakeUser("-1", DateTime.UtcNow)
        };

        // Act
        var result = tokenService.IsRefreshTokenActive(refreshToken);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void UpdateRefreshToken_WithMaxCountReached_RemoveOldestToken()
    {
        // Arrange
        var tokenService = new TokenService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);

        var tokens = new List<RefreshToken>();
        for (var i = 1; i <= RefreshTokenMaxCount; i++)
            tokens.Add(new RefreshToken
            {
                Token = $"valid-refresh-token-{i}",
                Expires = DateTime.UtcNow.AddDays(i),
                User = user
            });
        user.RefreshTokens = tokens;
        var oldestToken = tokens.OrderBy(t => t.Expires).First();

        // Act
        tokenService.UpdateRefreshToken(user);

        // Assert
        user.RefreshTokens.Count.Should().Be(RefreshTokenMaxCount - 1);
        user.RefreshTokens.Should().NotContain(rt => rt.Expires == oldestToken.Expires);
    }
}