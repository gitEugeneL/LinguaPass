using Common.GrpcProtos;
using Grpc.Core;
using Storage.Services.Interfaces;

namespace Storage.Grps.Servers;

public class StorageServer(IStorageService storageService) : Storages.StoragesBase
{
    public const string InvalidUser = "Invalid userId format";

    public override async Task<CheckFilesResponse> CheckFilesExist(
        CheckFilesRequest request,
        ServerCallContext context)
    {
        if (!Guid.TryParse(request.UserId, out var parseUserId))
            throw new RpcException(new Status(StatusCode.Unavailable, InvalidUser));

        if (!await storageService.BucketExists(parseUserId.ToString().ToLowerInvariant()))
            return new CheckFilesResponse { FilesExist = false };

        var fileNames = await storageService.GetCustomerFiles(parseUserId.ToString().ToLowerInvariant());

        return fileNames.Count > 0
            ? new CheckFilesResponse { FilesExist = true }
            : new CheckFilesResponse { FilesExist = false };
    }
}