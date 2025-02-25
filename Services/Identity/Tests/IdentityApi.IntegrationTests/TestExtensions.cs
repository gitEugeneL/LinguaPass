using Newtonsoft.Json;

namespace IdentityApi.IntegrationTests;

public static class TestExtensions
{
    public static async Task<T?> DeserializeResponse<T>(HttpResponseMessage response)
    {
        var jsonResponse = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<T>(jsonResponse);
    }
}