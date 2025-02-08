using Microsoft.AspNetCore.Identity;

namespace IdentityApi.Domain.Entities;

public sealed class User : IdentityUser
{
    public User(string email, int age)
    {
        Email = email;
        Age = age;
        UserName = email;
    }

    public DateTime CreateAt { get; init; } = DateTime.UtcNow;
    public int Age { get; init; }
    public DateTime DeleteAt { get; init; }

    // Relations
    public List<RefreshToken> RefreshTokens { get; init; } = [];
}