using Account.Data.Persistence;
using Account.Features.Shared;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetAccounts;

public class Endpoint(AppDbContext dbContext) : Endpoint<QueryParams, CollectionResponse<Response>>
{
    public override void Configure()
    {
        Get("/api/customers");
        Policies(Constants.AdminPolicy);
        ResponseCache(60);
    }

    public override async Task HandleAsync(QueryParams req, CancellationToken ct)
    {
        var dbQuery = dbContext
            .CustomerAccounts
            .Include(a => a.Contact)
            .OrderByDescending(a => a.UpdatedAt)
            .AsNoTracking()
            .AsQueryable();

        var count = await dbQuery
            .CountAsync(ct);

        var result = await dbQuery
            .Skip(req.PageSize * (req.PageNumber - 1))
            .Take(req.PageSize)
            .Select(a => new Response(
                a.Id,
                a.Contact != null ? a.Contact.Name : null,
                a.Contact != null ? a.Contact.Surname : null,
                a.SchoolId,
                a.ContactId,
                a.LanguageId,
                a.CreatedAt,
                a.UpdatedAt != DateTime.MinValue ? a.UpdatedAt : null
            ))
            .ToListAsync(ct);

        await SendResultAsync(TypedResults.Ok(
                new CollectionResponse<Response>(
                    result,
                    count,
                    req.PageNumber,
                    req.PageSize)
            )
        );
    }
}