using Account.Data.Persistence;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetUserShortData;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidUserData = "user not fount or short data is invalid";

    public override void Configure()
    {
        Get("/api/short-info");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidUserData);

        var result = await dbContext
            .CustomerContacts
            .Where(c => c.Account != null && c.Account.UserId == userId)
            .Select(c => new Response(c.Name, c.Surname))
            .FirstOrDefaultAsync(ct);

        return result is not null
            ? TypedResults.Ok(result)
            : TypedResults.NotFound(InvalidUserData);
    }
}