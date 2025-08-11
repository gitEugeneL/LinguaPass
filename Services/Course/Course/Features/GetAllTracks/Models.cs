namespace Course.Features.GetAllTracks;

public sealed record QueryParams(
    int PageNumber = 1,
    int PageSize = 10
);