using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.Logout;
using IdentityApi.Tools;

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
        var loginResponse = await _client.PostAsJsonAsync("api/login", new LoginRequest(email, password));
        // read cookie
        var cookies = loginResponse.Headers.GetValues("Set-Cookie").ToList();
        var refreshTokenCookie = cookies.FirstOrDefault(c => c.Contains(CookieSetter.CustomerRefreshCookieName));
        // set cookie
        _client.DefaultRequestHeaders.Add("Cookie", refreshTokenCookie);

        // Act
        var response =
            await _client.PostAsJsonAsync("api/logout",
                new RefreshOrLogoutRequest(registrationResult.UserId, "CUSTOMER"));
        var logoutCookies = response.Headers.GetValues("Set-Cookie").ToList();
        logoutCookies.Should().Contain(c =>
            c.Contains($"{CookieSetter.CustomerRefreshCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"));

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

        _client.DefaultRequestHeaders.Add("Cookie", invalidRefreshToken);

        // Act
        var response =
            await _client.PostAsJsonAsync("api/logout",
                new RefreshOrLogoutRequest(registrationResult.UserId, "CUSTOMER"));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt111@mail.test", "strongPwd!1")]
    [InlineData("mail222@mail.test", "myPassword12@")]
    public async Task Logout_WithValidUserAndUsedRefreshToken_ReturnsErrorMessage(string email, string password)
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
            await _client.PostAsJsonAsync("api/logout",
                new RefreshOrLogoutRequest(registrationResult.UserId, "CUSTOMER"));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt24@mail.test", "strongPwd!1")]
    [InlineData("mail245@mail.test", "myPassword12@")]
    public async Task Logout_WithInvalidUser_ReturnsErrorMessage(string email, string password)
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
        var response = await _client.PostAsJsonAsync("api/logout", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}