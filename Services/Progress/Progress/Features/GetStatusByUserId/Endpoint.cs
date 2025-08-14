using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Progress.Data;

namespace Progress.Features.GetStatusByUserId;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidStatus = "status not fount";

    public override void Configure()
    {
        Get("/api/status/{userId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("userId"), out var userId))
            return TypedResults.NotFound(InvalidUser);

        var result = await dbContext
            .CustomerProgress
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .Select(c => new Response(
                (int)c.Step,
                c.Step.ToString().Replace("Submission", "").Replace("Review", ""),
                c.Step.ToString().StartsWith("Submission") ? "Submission" : "Review"))
            .FirstOrDefaultAsync(ct);

        return result is not null
            ? TypedResults.Ok(result)
            : TypedResults.NotFound(InvalidStatus);
    }
}