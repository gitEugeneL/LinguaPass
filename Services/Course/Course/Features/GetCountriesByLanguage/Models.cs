namespace Course.Features.GetCountriesByLanguage;

public sealed record Response(
    Guid CountryId,
    string Name,
    bool IsActive,
    int SchoolsCount
);