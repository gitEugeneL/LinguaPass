namespace Course.Domain.Entities;

public sealed class Language
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; set; }
    public required bool IsActive { get; set; }
}