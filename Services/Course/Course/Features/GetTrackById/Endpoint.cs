using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetTrackById;

public class Endpoint(
    AppDbContext dbContext
) : EndpointWithoutRequest<Results<Ok<TrackResponse>, NotFound<string>, BadRequest<string>>>
{
    public const string InvalidTrack = "courseId is not found or invalid";

    public override void Configure()
    {
        Get("/api/courses/{courseId}");
        Policies(Constants.CustomerPolicy);
        ResponseCache(60);
    }

    public override async Task<Results<Ok<TrackResponse>, NotFound<string>, BadRequest<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("courseId"), out var courseId))
            return TypedResults.BadRequest(InvalidTrack);

        var result = await dbContext
            .Tracks
            .AsNoTracking()
            .Where(t => t.IsActive && t.Id == courseId)
            .Select(t => new TrackResponse(
                t.Id,
                t.Name,
                t.Description,
                t.Activities,
                t.Duration,
                t.Price,
                t.AdmissionFee,
                t.School.City,
                t.IsActive,
                t.WithAccommodation,
                t.Language.Name,
                t.School.Name,
                t.School.Country.Name,
                t.SchoolId,
                t.LanguageId)
            )
            .FirstOrDefaultAsync(ct);

        return result is not null
            ? TypedResults.Ok(result)
            : TypedResults.NotFound(InvalidTrack);
    }
}