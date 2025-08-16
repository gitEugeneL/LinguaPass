using AuthConfig.Tools;
using Course.Data.Persistence;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetDashboardInfo;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<IResult>
{
    public override void Configure()
    {
        Get("/api/dashboard");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        var countryCount = await dbContext
            .Countries
            .AsNoTracking()
            .Where(c => c.IsActive)
            .CountAsync(ct);

        var schoolCount = await dbContext
            .Schools
            .AsNoTracking()
            .Where(s => s.IsActive)
            .CountAsync(ct);

        var courseCount = await dbContext
            .Tracks
            .AsNoTracking()
            .Where(t => t.IsActive)
            .CountAsync(ct);

        var topCountry = await dbContext
            .Countries
            .AsNoTracking()
            .Where(c => c.IsActive)
            .Select(c => new { c.Name, SchoolCount = c.Schools.Count(s => s.IsActive) })
            .OrderByDescending(x => x.SchoolCount)
            .FirstAsync(ct);

        return TypedResults.Ok(new Response(
            countryCount,
            schoolCount,
            courseCount,
            topCountry.Name
        ));
    }
}