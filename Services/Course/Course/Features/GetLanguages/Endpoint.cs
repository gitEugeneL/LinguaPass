using Carter;
using Course.Contracts;
using Course.Contracts.Languages;
using Course.Helpers;
using MediatR;

namespace Course.Features.GetLanguages;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/languages",
                async ([AsParameters] LanguageQueryParams parameters, ISender sender, CancellationToken ct) =>
                {
                    var filter = Enum.TryParse<QueryFilter>(parameters.Filter, true, out var parsedFilter)
                        ? parsedFilter
                        : QueryFilter.Active;

                    var query = new Query(filter);
                    var result = await sender.Send(query, ct);

                    return result.Map<IResult>(
                        r => Results.Ok(new PaginatedResponse<Output>(r)),
                        e => Results.BadRequest(e.Message));
                })
            .RequireAuthorization(AppConstants.BasePolicy);
    }
}