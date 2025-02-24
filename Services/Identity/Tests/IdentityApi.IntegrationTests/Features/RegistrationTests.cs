using System.Net.Http.Json;
using IdentityApi.Contracts;

namespace IdentityApi.IntegrationTests.Features;

public class RegistrationTests(CustomWebAppApplicationFactory factory) : IClassFixture<CustomWebAppApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Theory]
    [InlineData("mailt@mail.test", "strongPwd!1", "strongPwd!1", 60)]
    [InlineData("mail1@mail.test", "myPassword12@", "myPassword12@", 18)]
    public async Task RegistrationResult_WithValidBody_ReturnsUserUd
        (string email, string password, string confirmPassword, int age)
    {
        // arrange
        var request = new RegistrationRequest(email, password, confirmPassword, age);

        // act
        var response = await _client.PostAsJsonAsync("registration", request);

        //assert
        response.EnsureSuccessStatusCode();
    }
}