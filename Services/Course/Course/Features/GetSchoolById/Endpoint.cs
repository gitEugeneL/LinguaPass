using AuthConfig.Tools;
using Course.Data.Persistence;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetSchoolById;

public class Endpoint(
    AppDbContext dbContext
) : EndpointWithoutRequest<Results<Ok<Response>, BadRequest<string>, NotFound<string>>>
{
    public const string InvalidSchool = "schoolId is not found or invalid";

    public override void Configure()
    {
        Get("/api/schools/{schoolId}");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task<Results<Ok<Response>, BadRequest<string>, NotFound<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("schoolId"), out var schoolId))
            return TypedResults.BadRequest(InvalidSchool);

        var result = await dbContext
            .Schools
            .AsNoTracking()
            .Where(s => s.IsActive &&
                        s.Id == schoolId)
            .Select(s => new Response(s.Id, s.Name, s.City, s.IsActive, s.CountryId))
            .FirstOrDefaultAsync(ct);

        return result is not null
            ? TypedResults.Ok(result)
            : TypedResults.NotFound(InvalidSchool);
    }
}