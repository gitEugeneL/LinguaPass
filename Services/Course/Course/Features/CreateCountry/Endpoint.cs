using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Domain.Entities;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.CreateCountry;

public class Endpoint(AppDbContext dbContext)
    : Endpoint<Request, Results<Ok<CountryResponse>, Conflict<string>>>
{
    public const string ConflictCountry = "This country already exists";


    public override void Configure()
    {
        Post("/api/countries");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<CountryResponse>, Conflict<string>>> ExecuteAsync(
        Request req,
        CancellationToken ct)
    {
        var result = await dbContext
            .Countries
            .AsNoTracking()
            .AnyAsync(c => c.Name.ToLower() == req.Name.ToLower().Trim(), ct);

        if (result)
            return TypedResults.Conflict(ConflictCountry);

        var country = new Country
        {
            Name = req.Name.Trim(),
            IsActive = req.IsActive
        };
        await dbContext.Countries.AddAsync(country, ct);
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(new CountryResponse(country.Id, country.Name, country.IsActive, country.Schools.Count));
    }
}