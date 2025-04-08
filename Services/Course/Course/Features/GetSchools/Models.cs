namespace Course.Features.GetSchools;

public sealed record QueryParams(string CountryId);

public sealed record Response(
    Guid SchoolId,
    string Name,
    string City,
    bool IsActive
);