using Account.Data.Persistence;
using Account.Grpc.Clients;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Domain.Enums;

namespace Account.Features.ApplicationComplete;

public class Endpoint(
    AppDbContext dbContext,
    ProgressClient progressClient,
    IProgressService progressService)
    : Endpoint<Request, Results<Ok<Response>, BadRequest<string>>>
{
    public const string InvalidUser = "user not fount or invalid";

    public override void Configure()
    {
        Patch("/api/complete-application");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<Response>, BadRequest<string>>> ExecuteAsync(
        Request req,
        CancellationToken ct)
    {
        if (!Guid.TryParse(req.UserId, out var userId))
            return TypedResults.BadRequest(InvalidUser);

        var account = await dbContext
            .CustomerAccounts
            .Include(a => a.Contact)
            .Include(a => a.Personal)
            .FirstOrDefaultAsync(a => a.UserId == userId && a.IsActive, ct);

        if (account?.CourseId is null || account.SchoolId is null || account.LanguageId is null ||
            account.Contact is null || account.Personal is null)
            return TypedResults.BadRequest(InvalidUser);

        // gRPC request (server: progress microservice)
        if (await progressClient.CheckStatusValidToComplete(userId) is false or null)
            return TypedResults.BadRequest(InvalidUser);

        account.IsApplicationComplete = req.IsApplicationValid;
        if (req.Message != null)
            account.ApplicationNote = req.Message;

        await dbContext.SaveChangesAsync(ct);

        // RabbitMQ request (consumer: progress microservice)
        await progressService.ChangeUserSteep(account.UserId, Steps.ReviewComplete);

        return TypedResults.Ok(new Response(account.UserId));
    }
}