using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Storage.Helpers;
using Storage.Services.Interfaces;

namespace Storage.Features.GetFilesByUserId;

public class Endpoint(IStorageService storageService)
    : EndpointWithoutRequest<Results<Ok<Response>, BadRequest<string>>>
{
    public const string InvalidUser = "user not fount or invalid";

    public override void Configure()
    {
        Get("/api/files/customers/{userId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<Response>, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("userId"), out var userId))
            return TypedResults.BadRequest(InvalidUser);

        if (!await storageService.BucketExists(userId.ToString().ToLowerInvariant()))
            return TypedResults.Ok(new Response([]));

        var fileNames = await storageService.GetCustomerFiles(userId.ToString().ToLowerInvariant());
        var cleanedFileNames = fileNames
            .Select(name => name
                .Replace($"{StorageConstants.CustomerFilesFolder.ToLowerInvariant()}/", ""))
            .ToList();

        return TypedResults.Ok(new Response(cleanedFileNames));
    }
}