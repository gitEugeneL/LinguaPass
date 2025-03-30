using Progress.Domain.Entities.Common;

namespace Progress.Domain.Entities;

public sealed class CustomerProgress : BaseAuditableEntity
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }

    /*** Relations ***/
    public Guid StepId { get; init; }
    public required Step Step { get; init; }
}