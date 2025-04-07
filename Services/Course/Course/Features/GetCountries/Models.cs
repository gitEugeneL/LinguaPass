namespace Course.Features.GetCountries;

public sealed record QueryParams(string LanguageId);

public sealed record Response(
    Guid CountryId,
    string Name,
    bool IsActive,
    int SchoolsCount
);