namespace Course.Features.GetSchoolsByLanguageAndCountry;

public sealed record QueryParams(string CountryId, string LanguageId);

public sealed record Response(
    Guid SchoolId,
    string Name,
    string City,
    bool IsActive
);