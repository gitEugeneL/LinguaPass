namespace Account.Features.ChooseSchool;

public sealed record Request(string LanguageId, string SchoolId);

public sealed record Response(Guid UserId, Guid? SchoolId);