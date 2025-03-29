using Common.GrpcProtos;

namespace Account.Grpc.Clients;

public class LanguageClient(Languages.LanguagesClient client)
{
    public async Task<bool?> CheckLanguage(Guid languageId)
    {
        try
        {
            var request = new CheckLanguageRequest
            {
                LanguageId = languageId.ToString()
            };
            var response = await client.CheckExistsAsync(request);
            return response.LanguageExists;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}