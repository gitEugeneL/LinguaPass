using Account.Domain.Entities.Common;
using Account.Domain.Entities.Enums;

namespace Account.Domain.Entities;

public sealed class CustomerContact : BaseAuditableEntity
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Phone { get; set; }
    public required Gender Gender { get; set; }
    public required TypeOfSettlement TypeOfSettlement { get; set; }
    public string? MiddleName { get; set; }
    public string? MaidenName { get; set; }

    /*** Relations ***/
    public Guid AddressId { get; init; }
    public required Address Address { get; init; }
}