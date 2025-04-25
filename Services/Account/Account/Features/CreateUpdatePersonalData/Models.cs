namespace Account.Features.CreateUpdatePersonalData;

public sealed record Request(
    string Birthday,
    string CountryOfBirth,
    string FathersName,
    string MothersName,
    string Nationality,
    string IdNumber,
    string CountryOfIssue,
    string ContactName,
    string ContactSurname,
    string Relationship,
    string ContactPhone,
    string EducationLevel
);

public sealed record Response(Guid UserId, Guid? PersonalId);