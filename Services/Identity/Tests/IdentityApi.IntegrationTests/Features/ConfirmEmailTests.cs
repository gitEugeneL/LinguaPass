using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.ConfirmEmail;
using IdentityApi.IntegrationTests.FakeServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityApi.IntegrationTests.Features;

public class ConfirmEmailTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private readonly IConfiguration _configuration = factory.Services.GetRequiredService<IConfiguration>();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1")]
    [InlineData("mail1@mail.test", "myPassword12@")]
    public async Task ConfirmEmail_WithValidUserAndCode_ReturnsConfirmResult(string email, string password)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        //  registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // generate confirm code
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));
        // get valid fake code
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        var request = new ConfirmEmailRequest(validCode, email);

        // Act
        var response = await _client.PostAsJsonAsync("confirm-email", request);
        var result = await TestExtensions.DeserializeResponse<ConfirmEmailResponse>(response);

        // Assert
        result.Should().NotBeNull();
        result.IsEmailConfirmed.Should().BeTrue();
        result.Email.Should().Be(email);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("mail31t@mail.test", "strongPwd!1")]
    [InlineData("mail123@mail.test", "myPassword12@")]
    public async Task ConfirmEmail_WithValidUserAndInvalidCode_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        //  registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // generate confirm code
        await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));
        // get invalid fake code
        var invalidCode = new string(Enumerable.Repeat('0', codeLength).ToArray());

        var request = new ConfirmEmailRequest(invalidCode, email);

        // Act
        var response = await _client.PostAsJsonAsync("confirm-email", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidCode);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mail321@mail.test", "strongPwd!1")]
    [InlineData("mail125@mail.test", "myPassword12@")]
    public async Task ConfirmEmail_WithValidUserAndAlreadyConfirmedEmail_ReturnsErrorMessage(
        string email,
        string password)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        //  registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // get valid fake code
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        // Act
        var response = new HttpResponseMessage();
        for (var i = 0; i < 2; i++)
        {
            await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));
            response = await _client.PostAsJsonAsync("confirm-email", new ConfirmEmailRequest(validCode, email));
        }

        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert 
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("dev321@mail.test", "strongPwd!1")]
    [InlineData("dev123@mail.test", "myPassword12@")]
    public async Task ConfirmEmail_WithValidUserAndWithoutGenerateCode_ReturnsErrorMessage(
        string email,
        string password)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        //  registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // get valid fake code
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        var request = new ConfirmEmailRequest(validCode, email);

        // Act
        var response = await _client.PostAsJsonAsync("confirm-email", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("test@mail.test")]
    [InlineData("test1@mail.test")]
    public async Task ConfirmEmail_WithInvalidUser_ReturnsErrorMessage(string email)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);

        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        var request = new ConfirmEmailRequest(validCode, email);

        // Act
        var response = await _client.PostAsJsonAsync("confirm-email", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("ma1@mail.test", "strongPwd!1")]
    [InlineData("ma@mail.test", "myPassword12@")]
    public async Task ConfirmEmail_WithLockoutUserAndValidCode_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var codeLength = int.Parse(_configuration["Authentication:Code.Length"]!);
        var codeMaxAttempts = int.Parse(_configuration["Authentication:Code.MaxAttempts"]!);
        //  registration
        await TestExtensions.RegistrationAsync(_client, email, password, password);
        // generate confirm code
        for (var i = 0; i <= codeMaxAttempts; i++)
            await _client.PostAsJsonAsync("generate-code", new GenerateCoreRequest(email));

        // get valid fake code
        var validCode = new string(Enumerable.Repeat(FakeConfirmationService.ValidCodeChar, codeLength).ToArray());

        var request = new ConfirmEmailRequest(validCode, email);

        // Act
        var response = await _client.PostAsJsonAsync("confirm-email", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidUser);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}