namespace Course.Domain.Entities;

public sealed class Country
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required bool IsActive { get; set; }

    /*** Relations ***/
    public List<School> Schools { get; init; } = [];
}