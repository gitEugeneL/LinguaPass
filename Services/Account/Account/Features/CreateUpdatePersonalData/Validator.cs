using FastEndpoints;
using FluentValidation;

namespace Account.Features.CreateUpdatePersonalData;

public sealed class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.Birthday)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(r => r.CountryOfBirth)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(r => r.FathersName)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(r => r.MothersName)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(r => r.Nationality)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(r => r.IdNumber)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(r => r.CountryOfIssue)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(r => r.ContactName)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(r => r.ContactSurname)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(r => r.Relationship)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(r => r.ContactPhone)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(r => r.EducationLevel)
            .NotEmpty()
            .MaximumLength();
    }
}