using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetSchoolsByLanguageAndCountry;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<Results<BadRequest<string>, Ok<CollectionResponse<SchoolResponse>>>>
{
    public const string InvalidCountryId = "countryId is invalid";
    public const string InvalidLanguageId = "languageId is invalid";

    public override void Configure()
    {
        Get("/api/schools/country/{countryId}/language/{languageId}");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task<Results<BadRequest<string>, Ok<CollectionResponse<SchoolResponse>>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("countryId"), out var countryId))
            return TypedResults.BadRequest(InvalidCountryId);

        if (!Guid.TryParse(Route<string>("languageId"), out var languageId))
            return TypedResults.BadRequest(InvalidLanguageId);

        var result = await dbContext
            .Schools
            .AsNoTracking()
            .Where(s => s.IsActive &&
                        s.CountryId == countryId &&
                        s.Languages
                            .Any(l => l.Id == languageId && l.IsActive))
            .Select(s => new SchoolResponse(
                s.Id,
                s.Name,
                s.City,
                s.IsActive,
                s.CountryId))
            .ToListAsync(ct);

        return TypedResults.Ok(new CollectionResponse<SchoolResponse>(result));
    }
}