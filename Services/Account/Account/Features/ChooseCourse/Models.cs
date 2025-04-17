namespace Account.Features.ChooseCourse;

public sealed record Request(string LanguageId, string SchoolId, string CourseId);

public sealed record Response(Guid UserId, Guid? CourseId);