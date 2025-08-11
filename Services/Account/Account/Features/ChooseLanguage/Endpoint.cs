using Account.Data.Persistence;
using Account.Grpc.Clients;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Domain.Enums;

namespace Account.Features.ChooseLanguage;

public class Endpoint(
    AppDbContext dbContext,
    CourseClient courseClient,
    IProgressService progressService
) : Endpoint<Request, Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidLanguage = "language not fount or invalid";
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidAccount = "account not fount or invalid";

    public override void Configure()
    {
        Post("/api/choose-language");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(
        Request req,
        CancellationToken ct)
    {
        if (!Guid.TryParse(req.LanguageId, out var languageId))
            return TypedResults.NotFound(InvalidLanguage);

        // gRPC request (server: course microservice)
        if (await courseClient.CheckLanguage(languageId) is false or null)
            return TypedResults.NotFound(InvalidLanguage);

        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidUser);

        var account = await dbContext
            .CustomerAccounts
            .FirstOrDefaultAsync(a => a.UserId == userId, ct);

        if (account is null || account.LanguageId == languageId)
            return TypedResults.NotFound(InvalidAccount);

        // RabbitMQ request (consumer: progress microservice)
        await progressService.ChangeUserSteep(account.UserId, Steps.SubmissionSchool);

        account.LanguageId = languageId;
        account.CourseId = null;
        account.SchoolId = null;
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(new Response(account.UserId, account.LanguageId));
    }
}