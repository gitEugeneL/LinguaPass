using Account.Data;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetUserLanguageId;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string LanguageDoesntExist = "user language does not exist";

    public override void Configure()
    {
        Get("/api/my-languageId");
        Post(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidUser);

        var userLanguageId = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .Select(a => a.LanguageId)
            .FirstOrDefaultAsync(ct);

        return userLanguageId is not null
            ? TypedResults.Ok(new Response(userLanguageId))
            : TypedResults.NotFound(LanguageDoesntExist);
    }
}