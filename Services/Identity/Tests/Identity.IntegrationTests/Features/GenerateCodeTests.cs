using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.GenerateCode;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityApi.IntegrationTests.Features;

public class GenerateCodeTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private readonly IConfiguration _configuration = factory.Services.GetRequiredService<IConfiguration>();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1")]
    [InlineData("mail1@mail.test", "myPassword12@")]
    public async Task GenerateCode_WithValidUser_CrateCodeAndReturnsInfo(string email, string password)
    {
        // Arrange
        var codeLifeTimeMinutes = int.Parse(_configuration["Authentication:Code.Lifetime.Minutes"]!);

        await TestExtensions.RegistrationAsync(_client, email, password, password);
        var request = new GenerateCodeRequest(email);

        // Act
        var response = await _client.PostAsJsonAsync("api/generate-code", request);
        var result = await TestExtensions.DeserializeResponse<GenerateCodeResponse>(response);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be(email);
        result.CodeExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(codeLifeTimeMinutes), TimeSpan.FromSeconds(3));

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("mailt123@mail.test")]
    [InlineData("mail1321@mail.test")]
    public async Task GenerateCode_WithInvalidUser_ReturnsErrorMessage(string email)
    {
        // Arrange
        var request = new GenerateCodeRequest(email);

        // Act
        var response = await _client.PostAsJsonAsync("api/generate-code", request);
        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("mailt@dev.test", "strongPwd!1")]
    [InlineData("mail1@dev.test", "myPassword12@")]
    public async Task GenerateCode_WithValidUserAndMultipleAttempts_ReturnsErrorMessage(string email, string password)
    {
        // Arrange
        var codeMaxAttempts = int.Parse(_configuration["Authentication:Code.MaxAttempts"]!);

        await TestExtensions.RegistrationAsync(_client, email, password, password);
        var request = new GenerateCodeRequest(email);

        // Act
        var response = new HttpResponseMessage();
        for (var i = 0; i <= codeMaxAttempts; i++)
            response = await _client.PostAsJsonAsync("api/generate-code", request);

        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.InvalidData);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}