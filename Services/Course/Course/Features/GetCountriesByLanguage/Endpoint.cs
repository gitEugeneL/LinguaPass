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

        var result = new CollectionResponse<Response>(
            await dbContext.Countries
                .AsNoTracking()
                .Where(c => c.IsActive && c.Schools
                    .Any(s => s.IsActive && s.Languages
                        .Any(l => l.Id == languageId && l.IsActive)))
                .Select(c => new
                {
                    Country = c,
                    SchoolCount = c.Schools
                        .Count(s =>
                            s.IsActive && s.Languages
                                .Any(l => l.Id == languageId && l.IsActive))
                })
                .OrderByDescending(x => x.SchoolCount)
                .Select(x => new Response(
                    x.Country.Id,
                    x.Country.Name,
                    x.Country.IsActive,
                    x.SchoolCount
                ))
                .ToListAsync(ct));

        return TypedResults.Ok(result);
    }
}