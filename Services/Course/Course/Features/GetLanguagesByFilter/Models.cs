namespace Course.Features.GetLanguagesByFilter;

public sealed record QueryParams(string? Filter);

public enum QueryFilter
{
    All,
    Active,
    Disabled
}

public sealed record Response(
    Guid LanguageId,
    string Name,
    string Description,
    bool IsActive
);