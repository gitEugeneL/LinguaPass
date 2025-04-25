namespace Account.Features.GetUserPersonalData;

public sealed record Response(
    Guid PersonalId,
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