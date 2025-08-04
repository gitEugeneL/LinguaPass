namespace Course.Features.GetLanguagesByFilter;

public sealed record QueryParams(string? Filter);

public enum QueryFilter
{
    All,
    Active,
    Disabled
}