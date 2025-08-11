namespace Account.Features.GetAccounts;

public sealed record QueryParams(
    int PageNumber = 1,
    int PageSize = 10,
    bool IsActive = false
);

public sealed record Response(
    Guid AccountId,
    string? Name,
    string? Surname,
    Guid? SchoolId,
    Guid? CourseId,
    Guid? LanguageId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);