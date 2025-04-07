using Common.GrpcProtos;
using Course.Data.Persistence;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;

namespace Course.Grpc.Servers;

public class LanguageServer(AppDbContext dbContext) : Languages.LanguagesBase
{
    public override async Task<CheckLanguageResponse> CheckExists(CheckLanguageRequest request,
        ServerCallContext context)
    {
        if (!Guid.TryParse(request.LanguageId, out var parseId))
            throw new RpcException(new Status(StatusCode.Unavailable, "Invalid LanguageId format"));

        var result = await dbContext
            .Languages
            .AnyAsync(l => l.Id == parseId);

        return new CheckLanguageResponse
        {
            LanguageExists = result
        };
    }
}