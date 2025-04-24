namespace Account.Features.GetUserAccount;

public sealed record Response(
    Guid UserId,
    Guid? LanguageId,
    Guid? SchoolId,
    Guid? CourseId,
    Guid? ContactId
);