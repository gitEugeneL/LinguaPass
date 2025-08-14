using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetSchoolsByCountryId;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<Results<Ok<CollectionResponse<SchoolAdminResponse>>, BadRequest<string>>>
{
    public const string InvalidCountryId = "countryId is invalid";

    public override void Configure()
    {
        Get("/api/schools/country/{countryId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<CollectionResponse<SchoolAdminResponse>>, BadRequest<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("countryId"), out var countryId))
            return TypedResults.BadRequest(InvalidCountryId);

        var result = await dbContext
            .Schools
            .AsNoTracking()
            .Where(s => s.CountryId == countryId)
            .Select(s => new SchoolAdminResponse(
                s.Id,
                s.Name,
                s.ShortName,
                s.City,
                s.Country.Name,
                s.IsActive,
                s.CountryId,
                s.Tracks.Count,
                s.Languages.Select(l => new BaseLanguageResponse(l.Id, l.Name))
            ))
            .ToListAsync(ct);

        return TypedResults.Ok(new CollectionResponse<SchoolAdminResponse>(result));
    }
}