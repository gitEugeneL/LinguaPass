namespace Account.Features.CreateUpdateContactData;

public sealed record Request(
    string Name,
    string Surname,
    string Phone,
    string? MiddleName,
    string? MaidenName,
    string Gender,
    string TypeOfSettlement,
    string Street,
    string HsApt,
    string City,
    string Country,
    string Postcode,
    string? CorrStreet,
    string? CorrHsApt,
    string? CorrCity,
    string? CorrCountry,
    string? CorrPostcode
);

public sealed record Response(Guid UserId, Guid? ContactId);