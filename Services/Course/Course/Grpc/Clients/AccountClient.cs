using Common.GrpcProtos;

namespace Course.Grpc.Clients;

public class AccountClient(Accounts.AccountsClient client)
{
    public async Task<bool?> CheckIsTrackActive(Guid trackId)
    {
        try
        {
            var request = new CheckIsTrackActiveRequest
            {
                TrackId = trackId.ToString()
            };
            var response = await client.CheckIsTrackActiveAsync(request);
            return response.IsActive;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}