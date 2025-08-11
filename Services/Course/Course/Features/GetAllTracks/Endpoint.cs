using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetAllTracks;

public class Endpoint(AppDbContext dbContext) : Endpoint<QueryParams, CollectionResponse<TrackResponse>>
{
    public override void Configure()
    {
        Get("/api/courses");
        Policies(Constants.AdminPolicy);
        ResponseCache(60);
    }

    public override async Task HandleAsync(QueryParams req, CancellationToken ct)
    {
        var dbQuery = dbContext
            .Tracks
            .OrderByDescending(t => t.SchoolId)
            .ThenByDescending(t => t.LanguageId)
            .AsNoTracking()
            .AsQueryable();

        var count = await dbQuery
            .CountAsync(ct);

        var result = await dbQuery
            .Skip(req.PageSize * (req.PageNumber - 1))
            .Take(req.PageSize)
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
            .ToListAsync(ct);

        await SendResultAsync(TypedResults.Ok(
                new CollectionResponse<TrackResponse>(
                    result,
                    count,
                    req.PageNumber,
                    req.PageSize)
            )
        );
    }
}