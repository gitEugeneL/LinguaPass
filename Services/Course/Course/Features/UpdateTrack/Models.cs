namespace Course.Features.UpdateTrack;

public sealed record Request(
    string CourseId,
    string? Name,
    string? Description,
    string? Activities,
    string? Duration,
    string? Price,
    string? AdmissionFee,
    bool? IsActive,
    bool? WithAccommodation,
    string? LanguageId
);