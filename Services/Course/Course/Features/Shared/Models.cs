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