namespace Course.Domain.Entities;

public sealed class School
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required string ShortName { get; set; }
    public required string City { get; set; }
    public required bool IsActive { get; set; }

    /*** Relations ***/
    public Guid CountryId { get; init; }
    public required Country Country { get; init; }

    public List<Language> Languages { get; init; } = [];

    public List<Track> Tracks { get; init; } = [];
}