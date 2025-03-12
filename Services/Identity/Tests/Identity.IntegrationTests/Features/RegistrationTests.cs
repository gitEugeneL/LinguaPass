using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using IdentityApi.Contracts;
using IdentityApi.Features.Registration;

namespace IdentityApi.IntegrationTests.Features;

public class RegistrationTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1", "strongPwd!1", 60)]
    [InlineData("mail1@mail.test", "myPassword12@", "myPassword12@", 18)]
    public async Task Registration_WithValidBody_ReturnsUserUd
        (string email, string password, string confirmPassword, int age)
    {
        // Arrange
        var request = new RegistrationRequest(email, password, confirmPassword);

        // Act
        var response = await _client.PostAsJsonAsync("registration", request);
        var result = await TestExtensions.DeserializeResponse<RegistrationResponse>(response);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().NotBeEmpty();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Registration_WithExistingUser_ReturnsErrorMessage()
    {
        // Arrange
        var request = new RegistrationRequest("test@email.com", "strongPwd!1", "strongPwd!1");

        // Act
        var response = new HttpResponseMessage();
        for (var i = 0; i < 2; i++)
            response = await _client.PostAsJsonAsync("registration", request);

        var result = await TestExtensions.DeserializeResponse<string>(response);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(Handler.AlreadyRegistered);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}