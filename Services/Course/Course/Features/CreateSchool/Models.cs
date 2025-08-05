namespace Course.Features.CreateSchool;

public sealed record Request(
    string Name,
    string ShortName,
    string City,
    string CountryId,
    List<string> LanguageIds
);