using System.Net.Http.Json;
using IdentityApi.Contracts;
using Newtonsoft.Json;
using LoginRequest = IdentityApi.Contracts.LoginRequest;

namespace IdentityApi.IntegrationTests;

public static class TestExtensions
{
    public static async Task<T> DeserializeResponse<T>(HttpResponseMessage response)
    {
        var jsonResponse = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<T>(jsonResponse)!;
    }

    public static async Task<RegistrationResponse> RegistrationAsync(
        HttpClient client,
        string email,
        string password,
        string confirmPassword,
        int age = 18)
    {
        var request = new RegistrationRequest(email, password, confirmPassword, age);
        var response = await client.PostAsJsonAsync("registration", request);
        return await DeserializeResponse<RegistrationResponse>(response);
    }

    public static async Task<LoginOrRefreshResponse> LoginAsync(HttpClient client, string email, string password)
    {
        var request = new LoginRequest(email, password);
        var response = await client.PostAsJsonAsync("login", request);
        return await DeserializeResponse<LoginOrRefreshResponse>(response);
    }
}