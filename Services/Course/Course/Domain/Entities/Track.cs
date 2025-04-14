namespace Course.Domain.Entities;

public sealed class Track
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Activities { get; set; }
    public required string Duration { get; set; }
    public required decimal Price { get; set; }
    public required decimal AdmissionFee { get; set; }
    public required bool IsActive { get; set; }

    public required bool WithAccommodation { get; set; }

    /*** Relations ***/
    public Guid LanguageId { get; init; }
    public required Language Language { get; init; }

    public Guid SchoolId { get; init; }
    public required School School { get; init; }
}