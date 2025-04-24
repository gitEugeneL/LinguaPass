using Account.Domain.Entities.Common;
using Account.Domain.Entities.Enums;

namespace Account.Domain.Entities;

public sealed class CustomerContact : BaseAuditableEntity
{
    public Guid Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public TypeOfSettlement TypeOfSettlement { get; set; }
    public string? MiddleName { get; set; }
    public string? MaidenName { get; set; }

    /*** Relations ***/
    public Guid AddressId { get; init; }
    public Address Address { get; init; }
    public CustomerAccount? Account { get; init; }
}