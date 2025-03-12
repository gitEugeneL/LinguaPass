namespace IdentityApi.Domain.Entities;

public sealed class Role
{
    public Guid Id { get; init; }
    public required string Name { get; init; }

    /*** Relations ***/

    public List<User> Users { get; init; } = [];
}