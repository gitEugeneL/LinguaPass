using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Storage.Helpers;
using Storage.Services.Interfaces;

namespace Storage.Features.DeleteUserFile;

public class Endpoint(
    IStorageService storageService
) : EndpointWithoutRequest<Results<Ok<Response>, BadRequest<string>, NotFound<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidFileName = "file name not fount or invalid";
    public const string InvalidFile = "file not fount or invalid";

    public override void Configure()
    {
        Delete("/api/files/{fileName}");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, BadRequest<string>, NotFound<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null || !await storageService.BucketExists(userId.ToString()!.ToLowerInvariant()))
            return TypedResults.BadRequest(InvalidUser);

        var fileName = Route<string>("fileName");
        if (fileName is null)
            return TypedResults.BadRequest(InvalidFileName);

        var deleteResult = await storageService
            .DeleteFile(userId.ToString()!.ToLowerInvariant(), StorageConstants.CustomerFilesFolder, fileName);

        return deleteResult
            ? TypedResults.Ok(new Response(deleteResult))
            : TypedResults.NotFound(InvalidFile);
    }
}