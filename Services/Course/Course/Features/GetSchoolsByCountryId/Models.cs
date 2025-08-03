namespace Course.Features.GetSchoolsByCountryId;

public sealed record BaseLanguageResponse(
    Guid LanguageId,
    string Name
);

public sealed record Response(
    Guid SchoolId,
    string Name,
    string City,
    bool IsActive,
    Guid CountryId,
    int TracksCount,
    IEnumerable<BaseLanguageResponse> Languages
);