using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetCountriesByLanguage;

public class Endpoint(AppDbContext dbContext)
    : Endpoint<QueryParams, Results<BadRequest<string>, Ok<CollectionResponse<Response>>>>
{
    public const string InvalidLanguageId = "languageId is invalid";

    public override void Configure()
    {
        Get("/api/countries");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task<Results<BadRequest<string>, Ok<CollectionResponse<Response>>>> ExecuteAsync(
        QueryParams req, CancellationToken ct)
    {
        if (!Guid.TryParse(req.LanguageId, out var languageId))
            return TypedResults.BadRequest(InvalidLanguageId);


        var result = await dbContext
            .Countries
            .AsNoTracking()
            .Where(c => c.IsActive &&
                        c.Schools
                            .Any(s => s.IsActive &&
                                      s.Languages
                                          .Any(l => l.Id == languageId && l.IsActive)))
            .Select(c => new Response(
                c.Id,
                c.Name,
                c.IsActive,
                c.Schools
                    .Count(s => s.IsActive &&
                                s.Languages
                                    .Any(l => l.Id == languageId && l.IsActive)))
            )
            .OrderByDescending(r => r.SchoolsCount)
            .ToListAsync(ct);

        return TypedResults.Ok(new CollectionResponse<Response>(result));
    }
}