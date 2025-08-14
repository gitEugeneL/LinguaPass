using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetTracksBySchoolId;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<Results<Ok<CollectionResponse<TrackResponse>>, BadRequest<string>>>
{
    public const string InvalidSchoolId = "schoolId is invalid";

    public override void Configure()
    {
        Get("/api/courses/school/{schoolId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<CollectionResponse<TrackResponse>>, BadRequest<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("schoolId"), out var schoolId))
            return TypedResults.BadRequest(InvalidSchoolId);

        var result = await dbContext
            .Tracks
            .AsNoTracking()
            .Where(t => t.SchoolId == schoolId)
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
                t.LanguageId
            ))
            .ToListAsync(ct);

        return TypedResults.Ok(new CollectionResponse<TrackResponse>(result));
    }
}