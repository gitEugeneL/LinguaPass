using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetSchoolsByCountryId;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<Results<Ok<CollectionResponse<Response>>, BadRequest<string>>>
{
    public const string InvalidCountryId = "countryId is invalid";

    public override void Configure()
    {
        Get("/api/schools/country/{countryId}");
        Policies(Constants.AdminPolicy);
        ResponseCache(60);
    }

    public override async Task<Results<Ok<CollectionResponse<Response>>, BadRequest<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("countryId"), out var countryId))
            return TypedResults.BadRequest(InvalidCountryId);

        var result = await dbContext
            .Schools
            .AsNoTracking()
            .Where(s => s.CountryId == countryId)
            .Select(s => new Response(
                s.Id,
                s.Name,
                s.City,
                s.IsActive,
                s.CountryId,
                s.Tracks.Count,
                s.Languages.Select(l => new BaseLanguageResponse(l.Id, l.Name))
            ))
            .ToListAsync(ct);

        return TypedResults.Ok(new CollectionResponse<Response>(result));
    }
}