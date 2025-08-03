namespace Course.Features.UpdateCountry;

public sealed record Request(
    string CountryId,
    string? Name,
    bool? IsActive
);