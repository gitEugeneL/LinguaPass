using Account.Data.Persistence;
using Account.Grpc.Clients;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Domain.Enums;

namespace Account.Features.SendApplication;

public class Endpoint(
    AppDbContext dbContext,
    ProgressClient progressClient,
    StorageClient storageClient,
    IProgressService progressService
) : EndpointWithoutRequest<Results<Ok<Response>, BadRequest<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidAccount = "invalid account";

    public override void Configure()
    {
        Patch("/api/send-application");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.BadRequest(InvalidUser);

        var account = await dbContext
            .CustomerAccounts
            .Include(a => a.Contact)
            .Include(a => a.Personal)
            .FirstOrDefaultAsync(a => a.UserId == userId && a.IsActive, ct);

        if (account is null)
            return TypedResults.BadRequest(InvalidUser);

        if (account.CourseId is null || account.SchoolId is null || account.LanguageId is null ||
            account.Contact is null || account.Personal is null)
            return TypedResults.BadRequest(InvalidAccount);

        // gRPC request (server: progress microservice)
        if (await progressClient.CheckStatusValidToSend(userId.Value) is false or null)
            return TypedResults.BadRequest(InvalidAccount);

        // gRPC request (server: storage microservice)
        if (await storageClient.CheckFilesValidToSend(userId.Value) is false or null)
            return TypedResults.BadRequest(InvalidAccount);

        // RabbitMQ request (consumer: progress microservice)
        await progressService.ChangeUserSteep(account.UserId, Steps.ReviewProcessing);

        account.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(new Response(account.UserId));
    }
}