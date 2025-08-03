namespace Course.Features.CreateCountry;

public sealed record Request(
    string Name,
    bool IsActive
);