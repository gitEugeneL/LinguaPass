namespace Course.Features.CreateTrack;

public sealed record Request(
    string Name,
    string Description,
    string Activities,
    string Duration,
    string Price,
    string AdmissionFee,
    bool IsActive,
    bool WithAccommodation,
    string SchoolId,
    string LanguageId
);