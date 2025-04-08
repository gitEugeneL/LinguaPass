using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetSchools;

public class Endpoint(AppDbContext dbContext)
    : Endpoint<QueryParams, Results<NotFound<string>, Ok<CollectionResponse<Response>>>>
{
    public const string InvalidCountryId = "countryId is invalid";

    public override void Configure()
    {
        Get("/api/schools");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task<Results<NotFound<string>, Ok<CollectionResponse<Response>>>> ExecuteAsync(
        QueryParams req, CancellationToken ct)
    {
        if (!Guid.TryParse(req.CountryId, out var countryId))
            return TypedResults.NotFound(InvalidCountryId);

        var result = new CollectionResponse<Response>(
            await dbContext
                .Schools
                .Where(s => s.CountryId == countryId)
                .Select(s => new Response(
                    s.Id,
                    s.Name,
                    s.City,
                    s.IsActive
                ))
                .ToListAsync(ct)
        );

        return TypedResults.Ok(result);
    }
}