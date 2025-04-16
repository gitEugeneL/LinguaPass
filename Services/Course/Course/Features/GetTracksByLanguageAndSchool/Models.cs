namespace Course.Features.GetTracksByLanguageAndSchool;

public sealed record Response(
    Guid CourseId,
    string Name,
    string Description,
    string Activities,
    string Duration,
    decimal Price,
    decimal AdmissionFee,
    string Location,
    bool IsActive,
    bool WithAccommodation,
    string LanguageName,
    string SchoolName,
    Guid SchoolId,
    Guid LanguageId
);