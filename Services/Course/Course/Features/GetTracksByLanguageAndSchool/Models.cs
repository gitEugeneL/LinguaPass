namespace Course.Features.GetTracksByLanguageAndSchool;

public sealed record Response(
    Guid CourseId,
    string Name,
    string Description,
    string Activities,
    string Duration,
    decimal Price,
    decimal AdmissionFee,
    bool IsActive,
    bool WithAccommodation,
    string LanguageName,
    Guid SchoolId,
    Guid LanguageId
);