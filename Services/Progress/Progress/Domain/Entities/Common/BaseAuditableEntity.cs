namespace Progress.Domain.Entities.Common;

public class BaseAuditableEntity
{
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
}