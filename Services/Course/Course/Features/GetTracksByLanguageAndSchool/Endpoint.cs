using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetTracksByLanguageAndSchool;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<Results<BadRequest<string>, Ok<CollectionResponse<Response>>>>
{
    public const string InvalidSchoolId = "schoolId is invalid";
    public const string InvalidLanguageId = "languageId is invalid";

    public override void Configure()
    {
        Get("/api/courses/school/{schoolId}/language/{languageId}");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task<Results<BadRequest<string>, Ok<CollectionResponse<Response>>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("schoolId"), out var schoolId))
            return TypedResults.BadRequest(InvalidSchoolId);

        if (!Guid.TryParse(Route<string>("languageId"), out var languageId))
            return TypedResults.BadRequest(InvalidLanguageId);

        var result = await dbContext
            .Tracks
            .AsNoTracking()
            .Where(t => t.IsActive &&
                        t.School.IsActive &&
                        t.Language.IsActive &&
                        t.LanguageId == languageId &&
                        t.SchoolId == schoolId)
            .Select(t => new Response(
                t.Id,
                t.Name,
                t.Description,
                t.Activities,
                t.Duration,
                t.Price,
                t.AdmissionFee,
                t.IsActive,
                t.WithAccommodation,
                t.Language.Name, // todo check result (if it's null I should fix)
                t.SchoolId,
                t.LanguageId
            ))
            .ToListAsync(ct);

        return TypedResults.Ok(new CollectionResponse<Response>(result));
    }
}