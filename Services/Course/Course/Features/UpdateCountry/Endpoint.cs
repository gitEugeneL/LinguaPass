using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.UpdateCountry;

public class Endpoint(AppDbContext dbContext)
    : Endpoint<Request, Results<Ok<CountryResponse>, NotFound<string>, Conflict<string>, BadRequest<string>>>
{
    public const string InvalidCountryId = "CountryId is invalid";
    public const string InvalidData = "Nothing to change";
    public const string InvalidName = "This name already exists";
    public const string InvalidDeactivation = "Cannot deactivate, it has active schools";

    public override void Configure()
    {
        Patch("/api/countries");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<CountryResponse>, NotFound<string>, Conflict<string>, BadRequest<string>>>
        ExecuteAsync(Request req, CancellationToken ct)
    {
        if (!Guid.TryParse(req.CountryId, out var countryId))
            return TypedResults.NotFound(InvalidCountryId);

        var country = await dbContext.Countries
            .Include(c => c.Schools)
            .FirstOrDefaultAsync(c => c.Id == countryId, ct);

        if (country is null)
            return TypedResults.NotFound(InvalidCountryId);

        if (req.Name is { } name && name != country.Name)
        {
            if (await dbContext.Countries.AsNoTracking().AnyAsync(c => c.Name.ToLower() == name.ToLower().Trim(), ct))
                return TypedResults.Conflict(InvalidName);

            if (!string.IsNullOrEmpty(name) &&
                !string.Equals(country.Name, name.Trim(), StringComparison.OrdinalIgnoreCase))
                country.Name = name.Trim();
        }

        if (req.IsActive is { } isActive && country.IsActive != isActive)
        {
            if (!isActive && country.Schools.Any(s => s.IsActive))
                return TypedResults.BadRequest(InvalidDeactivation);
            country.IsActive = isActive;
        }

        if (!dbContext.ChangeTracker.HasChanges())
            return TypedResults.BadRequest(InvalidData);

        await dbContext.SaveChangesAsync(ct);
        return TypedResults.Ok(new CountryResponse(country.Id, country.Name, country.IsActive, country.Schools.Count));
    }
}