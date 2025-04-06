using Progress.Domain.Entities.Common;
using Shared.Domain.Enums;

namespace Progress.Domain.Entities;

public sealed class CustomerProgress : BaseAuditableEntity
{
    public Guid Id { get; init; }
    public required Guid UserId { get; init; }

    public required Steps Step { get; set; }
}