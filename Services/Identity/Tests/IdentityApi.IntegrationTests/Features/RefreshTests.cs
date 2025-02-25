using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.Refresh;
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
        var loginResult = await TestExtensions.LoginAsync(_client, email, password);

        var request = new RefreshOrLogoutRequest(loginResult.RefreshToken, registrationResult.UserId);

        // Act
        var response = await _client.PostAsJsonAsync("refresh", request);
        var result = await TestExtensions.DeserializeResponse<LoginOrRefreshResponse>(response);

        // Assert
        result.Should().NotBeNull();
        result.IsEmailConfirmed.Should().BeFalse();
        result.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();

        result.AccessTokenExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(accessTokenMinutes), TimeSpan.FromSeconds(3));

        result.RefreshTokenExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddDays(refreshTokenDays), TimeSpan.FromSeconds(3));

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
        var request = new RefreshOrLogoutRequest(invalidRefreshToken, registrationResult.UserId);

        // Act
        var response = await _client.PostAsJsonAsync("refresh", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidToken);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt111@mail.test", "strongPwd!1")]
    [InlineData("mail222@mail.test", "myPassword12@")]
    public async Task Refresh_WithValidUserAndUsedRefreshToken_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var registrationResult = await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResult = await TestExtensions.LoginAsync(_client, email, password);

        var request = new RefreshOrLogoutRequest(loginResult.RefreshToken, registrationResult.UserId);

        // Act
        var response = new HttpResponseMessage();
        for (var i = 0; i < 2; i++)
            response = await _client.PostAsJsonAsync("refresh", request);

        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidToken);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt24@mail.test", "strongPwd!1")]
    [InlineData("mail245@mail.test", "myPassword12@")]
    public async Task Refresh_WithInvalidUser_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResult = await TestExtensions.LoginAsync(_client, email, password);

        var invalidUserId = Guid.NewGuid();
        var request = new RefreshOrLogoutRequest(loginResult.RefreshToken, invalidUserId);

        // Act
        var response = await _client.PostAsJsonAsync("refresh", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}