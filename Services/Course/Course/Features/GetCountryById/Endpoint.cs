using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetCountryById;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<Results<Ok<CountryResponse>, NotFound<string>, BadRequest<string>>>
{
    public const string InvalidCountryId = "countryId is invalid";

    public override void Configure()
    {
        Get("/api/countries/{countryId}");
        Policies(Constants.AdminPolicy);
        ResponseCache(60);
    }

    public override async Task<Results<Ok<CountryResponse>, NotFound<string>, BadRequest<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("countryId"), out var countryId))
            return TypedResults.BadRequest(InvalidCountryId);

        var result = await dbContext
            .Countries
            .AsNoTracking()
            .Where(c => c.Id == countryId)
            .Select(c => new CountryResponse(c.Id, c.Name, c.IsActive, c.Schools.Count))
            .FirstOrDefaultAsync(ct);

        return result is not null
            ? TypedResults.Ok(result)
            : TypedResults.NotFound(InvalidCountryId);
    }
}