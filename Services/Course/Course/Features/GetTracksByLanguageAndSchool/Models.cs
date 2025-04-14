namespace Course.Features.GetTracksByLanguageAndSchool;

public sealed record QueryParams(string SchoolId, string LanguageId);

public sealed record Response(
    Guid CourseId,
    string Name,
    string Description,
    string Activities,
    string Duration,
    decimal Price,
    decimal AdmissionFee,
    bool IsActive,
    string LanguageName,
    Guid SchoolId,
    Guid LanguageId
);