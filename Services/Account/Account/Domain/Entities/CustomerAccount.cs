using Account.Domain.Entities.Common;

namespace Account.Domain.Entities;

public sealed class CustomerAccount : BaseAuditableEntity
{
    public Guid Id { get; init; }
    public required Guid UserId { get; init; }
    public Guid? LanguageId { get; set; }
    public Guid? SchoolId { get; set; }
    public Guid? CourseId { get; set; }

    public bool IsActive { get; set; }

    /*** Relations ***/
    public Guid? ContactId { get; set; }
    public CustomerContact? Contact { get; set; }

    public Guid? PersonalId { get; set; }
    public CustomerPersonal? Personal { get; set; }
}