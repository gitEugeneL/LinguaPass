using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Storage.Helpers;
using Storage.Services.Interfaces;

namespace Storage.Features.GetUserFiles;

public class Endpoint(
    IStorageService storageService
) : EndpointWithoutRequest<Results<Ok<Response>, BadRequest<string>>>
{
    public const string InvalidUser = "user not fount or invalid";

    public override void Configure()
    {
        Get("/api/files");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null || !await storageService.BucketExists(userId.ToString()!.ToLowerInvariant()))
            return TypedResults.BadRequest(InvalidUser);

        var fileNames = await storageService.GetCustomerFiles(userId.ToString()!.ToLowerInvariant());
        var cleanedFileNames = fileNames
            .Select(name => name
                .Replace($"{StorageConstants.CustomerFilesFolder.ToLowerInvariant()}/", ""))
            .ToList();

        return TypedResults.Ok(new Response(cleanedFileNames));
    }
}