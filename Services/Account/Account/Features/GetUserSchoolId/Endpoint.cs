using Account.Data;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetUserSchoolId;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string SchoolDoesntExist = "user school does not exist";

    public override void Configure()
    {
        Get("/api/my-schoolId");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidUser);

        var userSchoolId = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .Select(a => a.SchoolId)
            .FirstOrDefaultAsync(ct);

        return userSchoolId is not null
            ? TypedResults.Ok(new Response(userSchoolId))
            : TypedResults.NotFound(SchoolDoesntExist);
    }
}