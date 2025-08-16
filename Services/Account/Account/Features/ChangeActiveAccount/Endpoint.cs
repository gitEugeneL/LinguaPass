using Account.Data.Persistence;
using Account.Grpc.Clients;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.ChangeActiveAccount;

public class Endpoint(
    AppDbContext dbContext,
    ProgressClient progressClient
) : Endpoint<Request, Results<BadRequest<string>, Ok<Response>>>
{
    public const string InvalidAccount = "Account is invalid or invalid status to change";

    public override void Configure()
    {
        Patch("/api/change-active/{accountId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<BadRequest<string>, Ok<Response>>> ExecuteAsync(
        Request req,
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("accountId"), out var accountId))
            return TypedResults.BadRequest(InvalidAccount);

        var account = await dbContext
            .CustomerAccounts
            .FirstOrDefaultAsync(a => a.Id == accountId, ct);

        if (account is null)
            return TypedResults.BadRequest(InvalidAccount);

        if (!req.IsActive)
        {
            // gRPC request (server: progress microservice)
            if (await progressClient.CheckStatusValidToArchive(account.UserId) is false or null)
                return TypedResults.BadRequest(InvalidAccount);

            account.IsActive = false;
        }
        else
        {
            account.IsActive = true;
        }

        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(new Response(true));
    }
}