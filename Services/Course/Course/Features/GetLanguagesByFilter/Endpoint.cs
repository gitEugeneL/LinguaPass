using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetLanguagesByFilter;

public class Endpoint(AppDbContext dbContext) : Endpoint<QueryParams, Response>
{
    public override void Configure()
    {
        Get("/api/languages");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task HandleAsync(QueryParams req, CancellationToken ct)
    {
        var filter = Enum.TryParse<QueryFilter>(req.Filter, true, out var parsedFilter)
            ? parsedFilter
            : QueryFilter.Active;

        var result = new CollectionResponse<Response>(
            await dbContext
                .Languages
                .AsNoTracking()
                .Where(l => filter == QueryFilter.All || l.IsActive == (filter == QueryFilter.Active))
                .Select(l => new Response(l.Id, l.Name, l.Description, l.IsActive))
                .ToListAsync(ct));

        await SendResultAsync(TypedResults.Ok(result));
    }
}