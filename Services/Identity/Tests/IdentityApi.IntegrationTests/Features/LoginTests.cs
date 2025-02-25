using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.Login;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityApi.IntegrationTests.Features;

public class LoginTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private readonly IConfiguration _configuration = factory.Services.GetRequiredService<IConfiguration>();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1")]
    [InlineData("mail1@mail.test", "myPassword12@")]
    public async Task Login_WithValidUser_ReturnsLoginData(string email, string password)
    {
        // Arrange
        var accessTokenMinutes = int.Parse(_configuration["Authentication:AccessToken.Lifetime.Minutes"]!);
        var refreshTokenDays = int.Parse(_configuration["Authentication:RefreshToken.Lifetime.Days"]!);

        await TestExtensions.RegistrationAsync(_client, email, password, password);
        var request = new LoginRequest(email, password);

        // Act
        var response = await _client.PostAsJsonAsync("login", request);
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
    [InlineData("mailt23@mail.test", "strongPwd!1")]
    [InlineData("mail43@mail.test", "myPassword12@")]
    public async Task Login_WithInvalidUser_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var request = new LoginRequest(email, password);

        // Act 
        var response = await _client.PostAsJsonAsync("login", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidLoginData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt99@mail.test", "strongPwd!1")]
    [InlineData("mail1123@mail.test", "myPassword12@")]
    public async Task Login_WithValidUserAndInvalidPassword_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        var request = new LoginRequest(email, "invalid-password123");

        // Act
        var response = await _client.PostAsJsonAsync("login", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidLoginData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}