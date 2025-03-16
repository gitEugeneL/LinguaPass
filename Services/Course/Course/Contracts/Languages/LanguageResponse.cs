namespace Course.Contracts.Languages;

public sealed record LanguageResponse(
    Guid LanguageId,
    string Name,
    string Description,
    bool IsActive
);