using Account.Data;
using Account.Grpc.Clients;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Domain.Enums;

namespace Account.Features.ChooseCourse;

public class Endpoint(
    AppDbContext dbContext,
    CourseClient courseClients,
    IProgressService progressService
) : Endpoint<Request, Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidLanguage = "language not fount or invalid";
    public const string InvalidSchool = "school not fount or invalid";
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidCourse = "course not fount or invalid";
    public const string InvalidAccount = "account not fount or invalid";

    public override void Configure()
    {
        Post("/api/choose-course");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(Request req, CancellationToken ct)
    {
        if (!Guid.TryParse(req.LanguageId, out var languageId))
            return TypedResults.NotFound(InvalidLanguage);

        if (!Guid.TryParse(req.SchoolId, out var schoolId))
            return TypedResults.NotFound(InvalidSchool);

        if (!Guid.TryParse(req.CourseId, out var courseId))
            return TypedResults.NotFound(InvalidCourse);

        // gRPC request (server: course microservice)
        if (await courseClients.CheckCourse(languageId, schoolId, courseId) is false or null)
            return TypedResults.NotFound(InvalidCourse);

        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidUser);

        var account = await dbContext
            .CustomerAccounts
            .FirstOrDefaultAsync(a => a.UserId == userId, ct);

        if (account is null)
            return TypedResults.NotFound(InvalidAccount);

        // RabbitMQ request (consumer: progress microservice)
        await progressService.ChangeUserSteep(account.UserId, Steps.SubmissionContact);

        if (account.CourseId != courseId)
        {
            account.CourseId = courseId;
            await dbContext.SaveChangesAsync(ct);
        }

        return TypedResults.Ok(new Response(account.UserId, account.CourseId));
    }
}