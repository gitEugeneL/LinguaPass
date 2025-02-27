using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.ResetPassword;
using IdentityApi.IntegrationTests.FakeServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityApi.IntegrationTests.Features;

public class ResetPasswordTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private readonly IConfiguration _configuration = factory.Services.GetRequiredService<IConfiguration>();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1", "devD3v123!")]
    [InlineData("mail1@mail.test", "myPassword12@", "devD3v123!")]
    public async Task ResetPassword_WithValidUserAndCode_ReturnsResetResult(
        string email,
        string password,
        string newPassword)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        // registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // get valid fake code
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        // generate code for confirm email
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));
        // confirm email
        await _client.PostAsJsonAsync("confirm-email", new ConfirmEmailRequest(validCode, email));
        // generate code for reset password
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));

        var request = new ResetPasswordRequest(email, validCode, newPassword, newPassword);

        // Act
        var response = await _client.PostAsJsonAsync("reset-password", request);
        var result = await TestExtensions.DeserializeResponse<ResetPasswordResponse>(response);

        // Assert
        result.Should().NotBeNull();
        result.IsPasswordChanged.Should().BeTrue();
        result.Email.Should().Be(email);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("mailt1@mail.test", "strongPwd!1", "devD3v123!")]
    [InlineData("mail12@mail.test", "myPassword12@", "devD3v123!")]
    public async Task ResetPassword_WithValidUserAndUnconfirmedEmail_ReturnsErrorMessage(
        string email,
        string password,
        string newPassword)
    {
        // Arrange
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        // registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // get valid fake code
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());
        // generate code for reset password
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));

        var request = new ResetPasswordRequest(email, validCode, newPassword, newPassword);

        // Act
        var response = await _client.PostAsJsonAsync("reset-password", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert 
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt@mail.dev", "strongPwd!1", "devD3v123!")]
    [InlineData("mail1@mail.dev", "myPassword12@", "devD3v123!")]
    public async Task ResetPassword_WithValidUserAndInvalidCode_ReturnsErrorMessage(
        string email,
        string password,
        string newPassword)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        // registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // get invalid code and valid code
        var invalidCode = new string(Enumerable.Repeat('0', codeLength).ToArray());
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        // generate code for confirm email
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));
        // confirm email
        await _client.PostAsJsonAsync("confirm-email", new ConfirmEmailRequest(validCode, email));
        // generate code for reset password
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));

        var request = new ResetPasswordRequest(email, invalidCode, newPassword, newPassword);

        // Act
        var response = await _client.PostAsJsonAsync("reset-password", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("dev@mail.dev", "devD3v123!")]
    [InlineData("dev1@mail.dev", "devD3v123!")]
    public async Task ResetPassword_WithInvalidUser_ReturnsErrorMessage(string email, string newPassword)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        var request = new ResetPasswordRequest(email, validCode, newPassword, newPassword);

        // Act
        var response = await _client.PostAsJsonAsync("reset-password", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt@dev.dev", "strongPwd!1", "devD3v123!")]
    [InlineData("mail1@dev.dev", "myPassword12@", "devD3v123!")]
    public async Task ResetPassword_WithLockoutUserAndValidCode_ReturnsErrorMessage(
        string email,
        string password,
        string newPassword)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        var codeMaxAttempts = int.Parse(_configuration["Authentication:Code.MaxAttempts"]!);
        // registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // get valid fake code
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        // generate code for confirm email
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));
        // confirm email
        await _client.PostAsJsonAsync("confirm-email", new ConfirmEmailRequest(validCode, email));
        // generate code for reset password
        for (var i = 0; i <= codeMaxAttempts; i++)
            await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));

        var request = new ResetPasswordRequest(email, validCode, newPassword, newPassword);

        // Act
        var response = await _client.PostAsJsonAsync("reset-password", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}