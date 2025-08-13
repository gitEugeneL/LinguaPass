using AuthConfig.Tools;
using FastEndpoints;
using Storage.Helpers;
using Storage.Services.Interfaces;

namespace Storage.Features.DownloadFile;

public class Endpoint(IStorageService storageService) : EndpointWithoutRequest<IResult>
{
    public const string InvalidParams = "invalid params";
    public const string FileNotFound = "file not found";

    public override void Configure()
    {
        Get("/api/download/{userId}/{fileName}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        var userId = Route<string>("userId");
        var fileName = Route<string>("fileName");

        if (userId is null || fileName is null)
            return TypedResults.BadRequest(InvalidParams);

        if (!await storageService.BucketExists(userId))
            return TypedResults.NotFound(FileNotFound);

        var customerName = $"{StorageConstants.CustomerFilesFolder}/{fileName.ToLowerInvariant()}";

        var filesList = await storageService.GetCustomerFiles(userId.ToLowerInvariant());

        if (filesList.All(file => !string.Equals(file, customerName, StringComparison.InvariantCultureIgnoreCase)))
            return TypedResults.NotFound(FileNotFound);

        var stream = await storageService.DownloadFile(userId, customerName);

        return TypedResults.File(stream, "application/pdf", fileName);
    }
}