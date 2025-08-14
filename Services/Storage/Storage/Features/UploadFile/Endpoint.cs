using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Storage.Helpers;
using Storage.MessageBroker.Services.Interfaces;
using Storage.Services.Interfaces;

namespace Storage.Features.UploadFile;

public class Endpoint(
    ISecurityService securityService,
    IStorageService storageService,
    IAccountService accountService
) : EndpointWithoutRequest<Results<Ok<Response>, BadRequest<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidFile = "file is not valid";
    public const string UploadFailed = "file upload failed";
    public const string FileLimitExceeded = "file limit exceeded";

    public override void Configure()
    {
        Post("/api/upload");
        AllowFileUploads();
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.BadRequest(InvalidUser);

        var file = Files.FirstOrDefault();
        if (file == null || file.Length == 0)
            return TypedResults.BadRequest(InvalidFile);

        var isFileValid = securityService.IsValidPdf(file);
        var isFileSizeValid = securityService.IsFileSizeValid(file);
        var isFileSafeFromMalware = await securityService.IsFileSafeFromMalware(file);

        if (!isFileValid || !isFileSizeValid || !isFileSafeFromMalware)
            return TypedResults.BadRequest(InvalidFile);

        var bucketName = userId.ToString()!;
        var fileName = $"{StorageConstants.CustomerFilesFolder}/{file.FileName.ToLowerInvariant()}";

        if (!await storageService.BucketExists(bucketName))
            await storageService.CreateBucket(bucketName);

        if (!await storageService.IsFileLimitNotExceeded(bucketName, StorageConstants.CustomerFilesFolder))
            return TypedResults.BadRequest(FileLimitExceeded);

        var storageUploadResult = await storageService.UploadFile(file, bucketName, fileName);
        if (!storageUploadResult)
            return TypedResults.BadRequest(UploadFailed);

        var fileNames = await storageService.GetCustomerFiles(bucketName);
        var cleanedFileNames = fileNames
            .Select(name => name
                .Replace($"{StorageConstants.CustomerFilesFolder.ToLowerInvariant()}/", ""))
            .ToList();

        // RabbitMQ request (consumer: account microservice)
        await accountService.UpdateAccountDate(userId.Value);

        return TypedResults.Ok(new Response(cleanedFileNames));
    }
}