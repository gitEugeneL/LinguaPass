namespace IdentityApi.Domain.Entities;

public sealed class ConfirmationCode
{
    public Guid Id { get; init; }
    public required string Code { get; set; }
    public required DateTime Expires { get; set; }

    // Relations
    public required User User { get; init; }
    public Guid UserId { get; init; }
}