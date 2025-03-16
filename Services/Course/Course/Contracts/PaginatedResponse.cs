namespace Course.Contracts;

public sealed class PaginatedResponse<T>(IReadOnlyCollection<T> items)
{
    public PaginatedResponse(IReadOnlyCollection<T> items, int totalItemsCount, int pageNumber, int pageSize) :
        this(items)
    {
        TotalItemsCount = totalItemsCount;
        PageNumber = pageNumber;
        PageSize = pageSize;
    }

    public IReadOnlyCollection<T> Items { get; } = items;
    public int? PageNumber { get; }
    public int? PageSize { get; }
    public int? TotalItemsCount { get; }

    public int? TotalPages => PageSize.HasValue && TotalItemsCount.HasValue
        ? (int)Math.Ceiling(TotalItemsCount.Value / (double)PageSize.Value)
        : null;
}