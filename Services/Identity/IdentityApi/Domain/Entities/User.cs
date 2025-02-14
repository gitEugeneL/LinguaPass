namespace IdentityApi.Domain.Entities;

public sealed class User
{
    public Guid Id { get; init; }
    public required string Email { get; set; }
    public required int Age { get; init; }
    public required byte[] PwdHash { get; init; }
    public required byte[] PwdSalt { get; init; }

    public bool EmailConfirmed { get; set; }
    public bool LoginLocked { get; set; }

    public bool ConfirmLocked { get; set; }
    public int LoginFailedCount { get; set; }
    public int ConfirmFailedCount { get; set; }
    public DateTime? LoginLockExpires { get; set; }
    public DateTime? ConfirmLockExpires { get; set; }

    public DateTime CreateAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdateAt { get; init; }
    public DateTime DeleteAt { get; init; }

    /*** Relations ***/

    public List<RefreshToken> RefreshTokens { get; init; } = [];
    public required Role Role { get; init; }
    public Guid RoleId { get; init; }

    public ConfirmationCode? ConfirmationCode { get; set; }
}