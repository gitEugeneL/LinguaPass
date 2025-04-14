using Account.Data;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetUserAccount;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidAccount = "user not fount or account is invalid";

    public override void Configure()
    {
        Get("/api/my-account");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidAccount);

        var userAccount = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .Select(a => new Response(a.UserId, a.LanguageId, a.SchoolId, a.CourseId))
            .FirstOrDefaultAsync(ct);

        return userAccount is not null
            ? TypedResults.Ok(userAccount)
            : TypedResults.NotFound(InvalidAccount);
    }
}