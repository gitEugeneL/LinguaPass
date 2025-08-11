namespace Account.Features.Shared;

public sealed record CollectionResponse<T>(
    IReadOnlyCollection<T> Items,
    int? TotalItemsCount = null,
    int? PageNumber = null,
    int? PageSize = null)
{
    public int? TotalPages => PageSize.HasValue && TotalItemsCount.HasValue
        ? (int)Math.Ceiling(TotalItemsCount.Value / (double)PageSize.Value)
        : null;
}

public sealed record ContactResponse(
    Guid ContactId,
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

public sealed record PersonalResponse(
    Guid PersonalId,
    DateOnly Birthday,
    string BirthPlace,
    string CountryOfBirth,
    string FathersName,
    string MothersName,
    string Nationality,
    string IdNumber,
    string CountryOfIssue,
    string ContactName,
    string ContactSurname,
    string Relationship,
    string ContactPhone,
    string EducationLevel
);