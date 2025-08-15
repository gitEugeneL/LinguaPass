using Account.Features.Shared;

namespace Account.Features.GetAccountById;

public sealed record Response(
    Guid AccountId,
    Guid? SchoolId,
    Guid? CourseId,
    Guid? LanguageId,
    Guid? UserId,
    bool IsActive,
    bool IsApplicationComplete,
    ContactResponse? Contact,
    PersonalResponse? Personal,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);