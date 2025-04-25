using Account.Domain.Entities.Common;
using Account.Domain.Entities.Enums;

namespace Account.Domain.Entities;

public sealed class CustomerPersonal : BaseAuditableEntity
{
    public Guid Id { get; init; }
    public DateOnly Birthday { get; set; }
    public string CountryOfBirth { get; set; } = string.Empty;
    public string FathersName { get; set; } = string.Empty;
    public string MothersName { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;
    public string IdNumber { get; set; } = string.Empty;
    public string CountryOfIssue { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string ContactSurname { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public Education EducationLevel { get; set; }

    /*** Relations ***/
    public CustomerAccount? Account { get; init; }
}