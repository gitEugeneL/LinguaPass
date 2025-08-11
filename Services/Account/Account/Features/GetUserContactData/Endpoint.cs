using Account.Data.Persistence;
using Account.Features.Shared;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Account.Features.GetUserContactData;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<Ok<ContactResponse>, NotFound<string>>>
{
    public const string InvalidContactData = "user not fount or contact data is invalid";

    public override void Configure()
    {
        Get("/api/contact-data");
        Policies(Constants.CustomerPolicy);
    }

    public override async Task<Results<Ok<ContactResponse>, NotFound<string>>> ExecuteAsync(CancellationToken ct)
    {
        var userId = TokenReader.ReadUserId(HttpContext);
        if (userId is null)
            return TypedResults.NotFound(InvalidContactData);

        var contactData = await dbContext
            .CustomerContacts
            .Where(c => c.Account != null && c.Account.UserId == userId)
            .Select(c => new ContactResponse(
                c.Id,
                c.Name,
                c.Surname,
                c.Phone,
                c.MiddleName,
                c.MaidenName,
                c.Gender.ToString().ToLower(),
                c.TypeOfSettlement.ToString().ToLower(),
                c.Address.Street,
                c.Address.HsApt,
                c.Address.City,
                c.Address.Country,
                c.Address.Postcode,
                c.Address.CorrStreet,
                c.Address.CorrHsApt,
                c.Address.CorrCity,
                c.Address.CorrCountry,
                c.Address.CorrPostcode
            ))
            .FirstOrDefaultAsync(ct);

        return contactData is not null
            ? TypedResults.Ok(contactData)
            : TypedResults.NotFound(InvalidContactData);
    }
}