using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetAllCountries;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<IResult>
{
    public override void Configure()
    {
        Get("/api/countries");
        Policies(Constants.AdminPolicy);
        ResponseCache(60);
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        var result = new CollectionResponse<CountryResponse>(
            await dbContext
                .Countries
                .AsNoTracking()
                .Select(c => new CountryResponse(c.Id, c.Name, c.IsActive, c.Schools.Count))
                .ToListAsync(ct)
        );

        return TypedResults.Ok(result);
    }
}