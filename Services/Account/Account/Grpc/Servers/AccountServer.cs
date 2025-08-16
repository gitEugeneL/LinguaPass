using Account.Data.Persistence;
using Common.GrpcProtos;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;

namespace Account.Grpc.Servers;

public class AccountServer(AppDbContext dbContext) : Accounts.AccountsBase
{
    public const string InvalidTrack = "Invalid trackId format";

    public override async Task<CheckIsTrackActiveResponse> CheckIsTrackActive(
        CheckIsTrackActiveRequest request,
        ServerCallContext context)
    {
        if (!Guid.TryParse(request.TrackId, out var parseId))
            throw new RpcException(new Status(StatusCode.Unavailable, InvalidTrack));

        var result = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .AnyAsync(c => c.IsActive && c.CourseId == parseId);

        return new CheckIsTrackActiveResponse { IsActive = result };
    }
}