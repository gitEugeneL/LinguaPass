namespace Course.Features.Shared;

public sealed record CollectionResponse<T>(
    IReadOnlyCollection<T> Items,
    int? TotalItemsCount = null,
    int? PageNumber = null,
    int? PageSize = null)
{
    public int? TotalPages => PageSize.HasValue && TotalItemsCount.HasValue
        ? (int)Math.Ceiling(TotalItemsCount.Value / (double)PageSize.Value)
        : null;
}

public sealed record CountryResponse(
    Guid CountryId,
    string Name,
    bool IsActive,
    int SchoolsCount
);

public interface ISchoolResponse;

public record SchoolResponse(
    Guid SchoolId,
    string Name,
    string City,
    bool IsActive,
    Guid CountryId
) : ISchoolResponse;

public sealed record SchoolAdminResponse(
    Guid SchoolId,
    string Name,
    string ShortName,
    string City,
    bool IsActive,
    Guid CountryId,
    int TracksCount,
    IEnumerable<BaseLanguageResponse> Languages
) : ISchoolResponse;

public sealed record LanguageResponse(
    Guid LanguageId,
    string Name,
    string Description,
    bool IsActive
);

public sealed record BaseLanguageResponse(
    Guid LanguageId,
    string Name
);

public sealed record TrackResponse(
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
    string CountryName,
    Guid SchoolId,
    Guid LanguageId
);