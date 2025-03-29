namespace Account.Domain.Entities;

public sealed class CustomerAccount
{
    public Guid Id { get; init; }
    public required Guid UserId { get; init; }

    public required Guid LanguageId { get; set; }

    // todo
    // db fields
    // todo
    // todo
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
}