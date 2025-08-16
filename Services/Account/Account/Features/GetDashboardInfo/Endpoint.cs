using Account.Data.Persistence;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetDashboardInfo;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<IResult>
{
    public override void Configure()
    {
        Get("/api/dashboard");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        // Current applications
        var currentApplicationCount = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .Where(a => a.IsActive)
            .CountAsync(ct);

        var archivedApplicationCount = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .Where(a => !a.IsActive)
            .CountAsync(ct);

        var lastUpdated = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .OrderByDescending(a => a.UpdatedAt)
            .FirstOrDefaultAsync(ct);

        return TypedResults.Ok(new Response(
            currentApplicationCount,
            archivedApplicationCount,
            lastUpdated?.UpdatedAt
        ));
    }
}