using Common.GrpcProtos;

namespace Account.Grpc.Clients;

public class ProgressClient(Progresses.ProgressesClient client)
{
    public async Task<bool?> CheckStatusValidToSend(Guid userId)
    {
        try
        {
            var request = new CheckStatusRequest { UserId = userId.ToString() };
            var response = await client.CheckStatusToSendApplicationAsync(request);
            return response.IsStatusValid;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<bool?> CheckStatusValidToComplete(Guid userId)
    {
        try
        {
            var request = new CheckStatusRequest { UserId = userId.ToString() };
            var response = await client.CheckStatusToCompleteApplicationAsync(request);
            return response.IsStatusValid;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<bool?> CheckStatusValidToArchive(Guid userId)
    {
        try
        {
            var request = new CheckStatusRequest { UserId = userId.ToString() };
            var response = await client.CheckStatusToArchiveApplicationAsync(request);
            return response.IsStatusValid;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}