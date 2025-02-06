using Microsoft.AspNetCore.Identity;

namespace IdentityApi.Domain.Entities;

public sealed class Role : IdentityRole
{
    public string? Description { get; init; } = string.Empty;
}