using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.Refresh;
using IdentityApi.Tools;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityApi.IntegrationTests.Features;

public class RefreshTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private readonly IConfiguration _configuration = factory.Services.GetRequiredService<IConfiguration>();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1")]
    [InlineData("mail1@mail.test", "myPassword12@")]
    public async Task Refresh_WithValidUserAndValidRefreshToken_ReturnsRefreshData(string email, string password)
    {
        // Arrange
        var accessTokenMinutes = int.Parse(_configuration["Authentication:AccessToken.Lifetime.Minutes"]!);
        var refreshTokenDays = int.Parse(_configuration["Authentication:RefreshToken.Lifetime.Days"]!);

        var registrationResult = await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResponse = await _client.PostAsJsonAsync("api/login", new LoginRequest(email, password));
        // read cookie
        var userCookies = loginResponse.Headers.GetValues("Set-Cookie").ToList();
        var userRefreshToken = userCookies.FirstOrDefault(c => c.Contains(CookieSetter.CustomerRefreshCookieName));
        // set cookie
        _client.DefaultRequestHeaders.Add("Cookie", userRefreshToken);

        var request = new RefreshOrLogoutRequest(registrationResult.UserId, "CUSTOMER");

        // Act
        var response = await _client.PostAsJsonAsync("api/refresh", request);
        var result = await TestExtensions.DeserializeResponse<LoginOrRefreshResponse>(response);
        var resultCookies = response.Headers.GetValues("Set-Cookie").ToList();
        var resultRefreshToken = resultCookies.FirstOrDefault(c => c.Contains(CookieSetter.CustomerRefreshCookieName));

        // Assert
        result.Should().NotBeNull();
        result.IsEmailConfirmed.Should().BeFalse();
        result.AccessToken.Should().NotBeNullOrEmpty();

        result.AccessTokenExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(accessTokenMinutes), TimeSpan.FromSeconds(3));

        result.RefreshTokenExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddDays(refreshTokenDays), TimeSpan.FromSeconds(3));

        resultCookies.Should().Contain(c => c.Contains(CookieSetter.CustomerRefreshCookieName));
        resultRefreshToken.Should().Contain(CookieSetter.CustomerRefreshCookieName + "=");
        resultRefreshToken.Should().Contain("secure");
        resultRefreshToken.Should().Contain("httponly");
        resultRefreshToken.Should().Contain("samesite=strict");

        resultRefreshToken.Should()
            .Contain($"expires={DateTime.UtcNow.AddDays(refreshTokenDays):R}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("mailt123@mail.test", "strongPwd!1")]
    [InlineData("mail321@mail.test", "myPassword12@")]
    public async Task Refresh_WithValidUserAndInvalidRefreshToken_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var registrationResult = await TestExtensions.RegistrationAsync(_client, email, password, password);

        var invalidRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(256));

        _client.DefaultRequestHeaders.Add("Cookie", invalidRefreshToken);

        // Act
        var response =
            await _client.PostAsJsonAsync("api/refresh",
                new RefreshOrLogoutRequest(registrationResult.UserId, "CUSTOMER"));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt111@mail.test", "strongPwd!1")]
    [InlineData("mail222@mail.test", "myPassword12@")]
    public async Task Refresh_WithValidUserAndUsedRefreshToken_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var registrationResult = await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResponse = await _client.PostAsJsonAsync("api/login", new LoginRequest(email, password));
        // read cookie
        var cookies = loginResponse.Headers.GetValues("Set-Cookie").ToList();
        var refreshTokenCookie = cookies.FirstOrDefault(c => c.Contains(CookieSetter.CustomerRefreshCookieName));
        // set cookie
        _client.DefaultRequestHeaders.Add("Cookie", refreshTokenCookie);

        await _client.PostAsJsonAsync("api/refresh", new RefreshOrLogoutRequest(registrationResult.UserId, "CUSTOMER"));
        _client.DefaultRequestHeaders.Add("Cookie", refreshTokenCookie);

        // Act
        var response =
            await _client.PostAsJsonAsync("api/refresh",
                new RefreshOrLogoutRequest(registrationResult.UserId, "CUSTOMER"));
        ;

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt24@mail.test", "strongPwd!1")]
    [InlineData("mail245@mail.test", "myPassword12@")]
    public async Task Refresh_WithInvalidUser_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResponse = await _client.PostAsJsonAsync("api/login", new LoginRequest(email, password));
        // read cookie
        var cookies = loginResponse.Headers.GetValues("Set-Cookie").ToList();
        var refreshTokenCookie = cookies.FirstOrDefault(c => c.Contains(CookieSetter.CustomerRefreshCookieName));
        // set cookie
        _client.DefaultRequestHeaders.Add("Cookie", refreshTokenCookie);

        var invalidUserId = Guid.NewGuid();
        var request = new RefreshOrLogoutRequest(invalidUserId, "CUSTOMER");

        // Act
        var response = await _client.PostAsJsonAsync("api/refresh", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}