using Microsoft.AspNetCore.Identity;

namespace IdentityApi.Domain.Entities;

public sealed class User : IdentityUser
{
    public DateTime CreateAt = DateTime.UtcNow;
    public int Age { get; init; }
    public DateTime DeleteAt { get; init; }

    // Relations
    public List<RefreshToken> RefreshTokens { get; init; } = [];
}