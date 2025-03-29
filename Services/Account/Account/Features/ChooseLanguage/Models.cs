namespace Account.Features.ChooseLanguage;

public sealed record Request(Guid LanguageId);

public sealed record Response(Guid UserId, Guid LanguageId);