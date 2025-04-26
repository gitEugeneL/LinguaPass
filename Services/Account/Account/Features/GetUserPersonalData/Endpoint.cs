using Account.Data.Persistence;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetUserPersonalData;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidPersonalData = "user not fount or personal data is invalid";

    public override void Configure()
    {
        Get("/api/personal-data");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidPersonalData);

        var personalData = await dbContext
            .CustomerPersonals
            .Where(p => p.Account != null && p.Account.UserId == userId)
            .Select(p => new Response(
                p.Id,
                p.Birthday,
                p.BirthPlace,
                p.CountryOfBirth,
                p.FathersName,
                p.MothersName,
                p.Nationality,
                p.IdNumber,
                p.CountryOfIssue,
                p.ContactName,
                p.ContactSurname,
                p.Relationship,
                p.ContactPhone,
                p.EducationLevel.ToString().ToLower()
            ))
            .FirstOrDefaultAsync(ct);

        return personalData is not null
            ? TypedResults.Ok(personalData)
            : TypedResults.NotFound(InvalidPersonalData);
    }
}