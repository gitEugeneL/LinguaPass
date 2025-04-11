namespace Account.Features.ChooseLanguage;

public sealed record Request(string LanguageId);

public sealed record Response(Guid UserId, Guid? LanguageId);