namespace Course.Features.GetTracksByLanguageAndSchool;

public sealed record QueryParams(string SchoolId, string LanguageId);

public sealed record Response(
    Guid TrackId,
    string Name,
    string Description,
    string Activities,
    string Duration,
    decimal Price,
    decimal AdmissionFee,
    bool IsActive
);