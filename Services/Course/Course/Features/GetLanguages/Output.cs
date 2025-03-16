namespace Course.Features.GetLanguages;

public sealed record Output(
    Guid LanguageId,
    string Name,
    string Description,
    bool IsActive
);