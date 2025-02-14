namespace IdentityApi.Domain.Entities;

public sealed class ConfirmationCode
{
    public Guid Id { get; init; }
    public required string Code { get; init; }
    public required DateTime Expires { get; init; }

    // Relations
    public required User User { get; init; }
    public required Guid UserId { get; init; }
}