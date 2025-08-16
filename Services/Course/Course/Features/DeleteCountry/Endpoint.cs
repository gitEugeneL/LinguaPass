using AuthConfig.Tools;
using Course.Data.Persistence;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.DeleteCountry;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<NoContent, BadRequest<string>>>
{
    public const string InvalidCountry = "CountryId is invalid";
    public const string InvalidDelete = "Cannot delete, it has active schools";


    public override void Configure()
    {
        Delete("/api/countries/{countryId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<NoContent, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("countryId"), out var countryId))
            return TypedResults.BadRequest(InvalidCountry);

        var country = await dbContext
            .Countries
            .Include(c => c.Schools)
            .FirstOrDefaultAsync(c => c.Id == countryId, ct);

        if (country is null)
            return TypedResults.BadRequest(InvalidCountry);

        if (country.Schools.Any(s => s.IsActive))
            return TypedResults.BadRequest(InvalidDelete);

        dbContext.Countries.Remove(country);
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.NoContent();
    }
}