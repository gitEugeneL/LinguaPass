using Common.GrpcProtos;

namespace Account.Grpc.Clients;

public class StorageClient(Storages.StoragesClient client)
{
    public async Task<bool?> CheckFilesValidToSend(Guid userId)
    {
        try
        {
            var request = new CheckFilesRequest { UserId = userId.ToString() };
            var response = await client.CheckFilesExistAsync(request);
            return response.FilesExist;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}