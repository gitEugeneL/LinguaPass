using Course.Data;
using Course.Tools;
using FastEndpoints;

namespace Course.Features.GetLanguages;

public class Endpoint(AppDbContext dbContext) : Endpoint<QueryParams, Response>
{
    public override void Configure()
    {
        Get("/languages");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task HandleAsync(QueryParams req, CancellationToken ct)
    {
        var filter = Enum.TryParse<QueryFilter>(req.Filter, true, out var parsedFilter)
            ? parsedFilter
            : QueryFilter.Active;

        var result = await Repository.GetLanguages(filter, dbContext, ct);
        await SendResultAsync(TypedResults.Ok(result));
    }
}