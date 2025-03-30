namespace Account.Domain.Entities;

public sealed class CustomerAccount
{
    public Guid Id { get; init; }
    public required Guid UserId { get; init; }
    public Guid? LanguageId { get; set; }
    public Guid? SchoolId { get; set; }
    public Guid? CourseId { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
}