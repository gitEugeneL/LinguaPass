using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Grpc.Clients;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.DeleteTrack;

public class Endpoint(
    AppDbContext dbContext,
    AccountClient accountClient
) : EndpointWithoutRequest<Results<NoContent, BadRequest<string>>>
{
    public const string InvalidTrack = "CourseId is invalid";
    public const string InvalidDelete = "Cannot delete, it has active students";

    public override void Configure()
    {
        Delete("/api/courses/{trackId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<NoContent, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("trackId"), out var trackId))
            return TypedResults.BadRequest(InvalidTrack);

        var track = await dbContext
            .Tracks
            .FirstOrDefaultAsync(t => t.Id == trackId, ct);

        if (track is null)
            return TypedResults.BadRequest(InvalidTrack);

        // gRPC request (server: account microservice)
        if (await accountClient.CheckIsTrackActive(trackId) is true or null)
            return TypedResults.BadRequest(InvalidDelete);

        dbContext.Tracks.Remove(track);
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.NoContent();
    }
}