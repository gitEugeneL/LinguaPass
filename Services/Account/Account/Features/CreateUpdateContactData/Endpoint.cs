using Account.Data.Persistence;
using Account.Domain.Entities;
using Account.Domain.Entities.Enums;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Tools;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Domain.Enums;

namespace Account.Features.CreateUpdateContactData;

public class Endpoint(
    AppDbContext dbContext,
    IProgressService progressService
) : Endpoint<Request, Results<Ok<Response>, Conflict<string>, NotFound<string>>>
{
    public const string InvalidUser = "user not fount or invalid";
    public const string InvalidContactData = "invalid account or contact data already exists";

    public override void Configure()
    {
        Post("/api/contact-data");
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
            .Include(a => a.Contact)
            .ThenInclude(customerContact => customerContact!.Address)
            .FirstOrDefaultAsync(a => a.UserId == userId, ct);

        if (account is null)
            return TypedResults.NotFound(InvalidContactData);

        var contact = account.Contact ?? new CustomerContact { Address = new Address() };

        UpdateContactAndAddress(contact, req);
        if (account.Contact is null)
        {
            account.Contact = contact;
            await dbContext.AddAsync(contact, ct);
        }

        await dbContext.SaveChangesAsync(ct);

        // RabbitMQ request (consumer: progress microservice)
        await progressService.ChangeUserSteep(account.UserId, Steps.SubmissionPersonal);

        return TypedResults.Ok(new Response(account.UserId, account.ContactId));
    }

    private static void UpdateContactAndAddress(CustomerContact contact, Request req)
    {
        // Update contact properties
        contact.Name = req.Name.Trim();
        contact.Surname = req.Surname.Trim();
        contact.Phone = req.Phone.Trim();
        contact.MaidenName = req.MaidenName?.Trim();
        contact.MiddleName = req.MiddleName?.Trim();
        contact.Gender = Enum.Parse<Gender>(req.Gender, true);
        contact.TypeOfSettlement = Enum.Parse<TypeOfSettlement>(req.TypeOfSettlement, true);

        // Update address properties
        contact.Address.Street = req.Street.Trim();
        contact.Address.HsApt = req.HsApt.Trim();
        contact.Address.City = req.City.Trim();
        contact.Address.Country = req.Country.Trim();
        contact.Address.Postcode = req.Postcode.Trim();
        contact.Address.CorrStreet = req.CorrStreet?.Trim();
        contact.Address.CorrHsApt = req.CorrHsApt?.Trim();
        contact.Address.CorrCity = req.CorrCity?.Trim();
        contact.Address.CorrCountry = req.CorrCountry?.Trim();
        contact.Address.CorrPostcode = req.CorrPostcode?.Trim();
    }
}