using Account.Data.Persistence;
using Account.Features.Shared;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetAccountById;

public class Endpoint(AppDbContext dbContext)
    : EndpointWithoutRequest<Results<Ok<Response>, NotFound<string>>>
{
    public const string InvalidCustomer = "customerId is not found or invalid";

    public override void Configure()
    {
        Get("/api/customers/{customerId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<Response>, NotFound<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("customerId"), out var customerId))
            return TypedResults.NotFound(InvalidCustomer);

        var result = await dbContext
            .CustomerAccounts
            .AsNoTracking()
            .Where(a => a.Id == customerId)
            .Select(a => new Response(
                a.Id,
                a.SchoolId,
                a.CourseId,
                a.LanguageId,
                a.UserId,
                a.IsActive,
                a.IsApplicationComplete,
                a.Contact != null
                    ? new ContactResponse(
                        a.Contact.Id,
                        a.Contact.Name,
                        a.Contact.Surname,
                        a.Contact.Phone,
                        a.Contact.MiddleName,
                        a.Contact.MaidenName,
                        a.Contact.Gender.ToString().ToLower(),
                        a.Contact.TypeOfSettlement.ToString().ToLower(),
                        a.Contact.Address.Street,
                        a.Contact.Address.HsApt,
                        a.Contact.Address.City,
                        a.Contact.Address.Country,
                        a.Contact.Address.Postcode,
                        a.Contact.Address.CorrStreet,
                        a.Contact.Address.CorrHsApt,
                        a.Contact.Address.CorrCity,
                        a.Contact.Address.CorrCountry,
                        a.Contact.Address.CorrPostcode
                    )
                    : null,
                a.Personal != null
                    ? new PersonalResponse(
                        a.Personal.Id,
                        a.Personal.Birthday,
                        a.Personal.BirthPlace,
                        a.Personal.CountryOfBirth,
                        a.Personal.FathersName,
                        a.Personal.MothersName,
                        a.Personal.Nationality,
                        a.Personal.IdNumber,
                        a.Personal.CountryOfIssue,
                        a.Personal.ContactName,
                        a.Personal.ContactSurname,
                        a.Personal.Relationship,
                        a.Personal.ContactPhone,
                        a.Personal.EducationLevel.ToString().ToLower()
                    )
                    : null,
                a.CreatedAt,
                a.UpdatedAt != DateTime.MinValue ? a.UpdatedAt : null)
            )
            .FirstOrDefaultAsync(ct);

        return result is not null
            ? TypedResults.Ok(result)
            : TypedResults.NotFound(InvalidCustomer);
    }
}