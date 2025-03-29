using Account.Grpc.Clients;
using Account.Tools;
using FastEndpoints;

namespace Account.Features.ChooseLanguage;

public class Endpoint(LanguageClient languageClient) : Endpoint<Request, Response>
{
    public override void Configure()
    {
        Post("/api/choose-language");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        var r = await languageClient.CheckLanguage(req.LanguageId);

        Console.WriteLine(r);
        await SendResultAsync(TypedResults.Ok());
    }
}