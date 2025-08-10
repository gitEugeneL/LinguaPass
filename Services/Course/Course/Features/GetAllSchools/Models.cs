namespace Course.Features.GetAllSchools;

public sealed record QueryParams(
    int PageNumber = 1,
    int PageSize = 10
);