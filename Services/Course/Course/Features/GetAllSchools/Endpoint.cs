using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetAllSchools;

public class Endpoint(AppDbContext dbContext) : Endpoint<QueryParams, CollectionResponse<SchoolAdminResponse>>
{
    public override void Configure()
    {
        Get("/api/schools");
        Policies(Constants.AdminPolicy);
        ResponseCache(60);
    }

    public override async Task HandleAsync(QueryParams req, CancellationToken ct)
    {
        var dbQuery = dbContext
            .Schools
            .OrderByDescending(s => s.Tracks.Count)
            .ThenByDescending(s => s.Country.Name)
            .AsNoTracking()
            .AsQueryable();

        var count = await dbQuery
            .CountAsync(ct);

        var result = await dbQuery
            .Skip(req.PageSize * (req.PageNumber - 1))
            .Take(req.PageSize)
            .Select(s => new SchoolAdminResponse(
                s.Id,
                s.Name,
                s.ShortName,
                s.City,
                s.Country.Name,
                s.IsActive,
                s.CountryId,
                s.Tracks.Count,
                s.Languages.Select(l => new BaseLanguageResponse(l.Id, l.Name)))
            )
            .ToListAsync(ct);

        await SendResultAsync(TypedResults.Ok(
                new CollectionResponse<SchoolAdminResponse>(
                    result,
                    count,
                    req.PageNumber,
                    req.PageSize)
            )
        );
    }
}