namespace Progress.Domain.Entities;

public sealed class Step
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required uint Order { get; init; }

    /*** Relations ***/
    public List<CustomerProgress> CustomerProgress { get; init; } = [];
}