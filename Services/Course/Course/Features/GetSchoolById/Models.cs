namespace Course.Features.GetSchoolById;

public sealed record Response(
    Guid SchoolId,
    string Name,
    string City,
    bool IsActive,
    Guid CountryId
);