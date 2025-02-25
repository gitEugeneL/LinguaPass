using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.Logout;

namespace IdentityApi.IntegrationTests.Features;

public class LogoutTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1")]
    [InlineData("mail1@mail.test", "myPassword12@")]
    public async Task Logout_WithValidUserAndValidRefreshToken_ReturnsLogoutData(string email, string password)
    {
        // Arrange
        var registrationResult = await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResult = await TestExtensions.LoginAsync(_client, email, password);

        var request = new RefreshOrLogoutRequest(loginResult.RefreshToken, registrationResult.UserId);

        // Act
        var response = await _client.PostAsJsonAsync("logout", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Theory]
    [InlineData("mailt123@mail.test", "strongPwd!1")]
    [InlineData("mail321@mail.test", "myPassword12@")]
    public async Task Logout_WithValidUserAndInvalidRefreshToken_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var registrationResult = await TestExtensions.RegistrationAsync(_client, email, password, password);

        var invalidRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(256));
        var request = new RefreshOrLogoutRequest(invalidRefreshToken, registrationResult.UserId);

        // Act
        var response = await _client.PostAsJsonAsync("logout", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt111@mail.test", "strongPwd!1")]
    [InlineData("mail222@mail.test", "myPassword12@")]
    public async Task Logout_WithValidUserAndUsedRefreshToken_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var registrationResult = await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResult = await TestExtensions.LoginAsync(_client, email, password);

        var request = new RefreshOrLogoutRequest(loginResult.RefreshToken, registrationResult.UserId);
        await _client.PostAsJsonAsync("refresh", request);

        // Act
        var response = await _client.PostAsJsonAsync("logout", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt24@mail.test", "strongPwd!1")]
    [InlineData("mail245@mail.test", "myPassword12@")]
    public async Task Logout_WithInvalidUser_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        var loginResult = await TestExtensions.LoginAsync(_client, email, password);

        var invalidUserId = Guid.NewGuid();
        var request = new RefreshOrLogoutRequest(loginResult.RefreshToken, invalidUserId);

        // Act
        var response = await _client.PostAsJsonAsync("logout", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}