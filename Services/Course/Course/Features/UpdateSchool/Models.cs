namespace Course.Features.UpdateSchool;

public sealed record Request(
    string SchoolId,
    string? Name,
    string? ShortName,
    string? City,
    bool? IsActive,
    List<string> LanguageIds
);