using Account.Data.Persistence;
using Account.Domain.Entities;
using Account.Domain.Entities.Enums;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Domain.Enums;

namespace Account.Features.CreateUpdatePersonalData;

public class Endpoint(
    AppDbContext dbContext,
    IProgressService progressService
) : Endpoint<Request, Results<Ok<Response>, Conflict<string>, NotFound<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidPersonalData = "invalid account or personal data already exists";

    public override void Configure()
    {
        Post("/api/personal-data");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, Conflict<string>, NotFound<string>>> ExecuteAsync(
        Request req,
        CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidUser);

        var account = await dbContext
            .CustomerAccounts
            .Include(a => a.Personal)
            .FirstOrDefaultAsync(a => a.UserId == userId, ct);

        if (account is null)
            return TypedResults.NotFound(InvalidPersonalData);

        var personal = account.Personal ?? new CustomerPersonal();

        UpdatePersonal(personal, req);
        if (account.Personal is null)
        {
            account.Personal = personal;
            await dbContext.AddAsync(personal, ct);
        }

        await dbContext.SaveChangesAsync(ct);

        // RabbitMQ request (consumer: progress microservice)
        await progressService.ChangeUserSteep(account.UserId, Steps.SubmissionDocuments);

        return TypedResults.Ok(new Response(account.UserId, account.PersonalId));
    }

    private static void UpdatePersonal(CustomerPersonal personal, Request req)
    {
        // Update personal properties
        personal.Birthday = DateOnly.FromDateTime(DateTime.Parse(req.Birthday));
        personal.BirthPlace = req.BirthPlace.Trim();
        personal.CountryOfBirth = req.CountryOfBirth.Trim();
        personal.FathersName = req.FathersName.Trim();
        personal.MothersName = req.MothersName.Trim();
        personal.Nationality = req.Nationality.Trim();
        personal.IdNumber = req.IdNumber.Trim();
        personal.CountryOfIssue = req.CountryOfIssue.Trim();
        personal.ContactName = req.ContactName.Trim();
        personal.ContactSurname = req.ContactSurname.Trim();
        personal.Relationship = req.Relationship.Trim();
        personal.ContactPhone = req.ContactPhone.Trim();
        personal.EducationLevel = Enum.Parse<Education>(req.EducationLevel, true);
    }
}