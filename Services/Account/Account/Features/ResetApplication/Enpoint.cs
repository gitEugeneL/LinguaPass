using Account.Data.Persistence;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Domain.Enums;

namespace Account.Features.ResetApplication;

public class Endpoint(
    AppDbContext dbContext,
    IProgressService progressService
) : EndpointWithoutRequest<Results<Ok, BadRequest<string>>>
{
    public const string InvalidAccount = "account not fount or invalid";

    public override void Configure()
    {
        Get("/api/reset-application");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.BadRequest(InvalidAccount);


        var account = await dbContext
            .CustomerAccounts
            .FirstOrDefaultAsync(a => a.UserId == userId
                                      && a.IsActive
                                      && !a.IsApplicationComplete, ct);

        if (account is null)
            return TypedResults.BadRequest(InvalidAccount);

        // RabbitMQ request (consumer: progress microservice)
        await progressService.ChangeUserSteep(account.UserId, Steps.SubmissionLanguage);

        return TypedResults.Ok();
    }
}