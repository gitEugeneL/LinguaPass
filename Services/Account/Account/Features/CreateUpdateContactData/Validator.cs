using Account.Domain.Entities.Enums;
using FastEndpoints;
using FluentValidation;

namespace Account.Features.CreateUpdateContactData;

public sealed class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.Name)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(20);

        RuleFor(r => r.Surname)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(50);

        RuleFor(r => r.MiddleName)
            .MaximumLength(20);

        RuleFor(r => r.MaidenName)
            .MaximumLength(20);

        RuleFor(r => r.Gender)
            .NotEmpty()
            .Must(x => Enum.TryParse<Gender>(x, true, out _))
            .WithMessage("Invalid Gender");

        RuleFor(r => r.TypeOfSettlement)
            .NotEmpty()
            .Must(x => Enum.TryParse<TypeOfSettlement>(x, true, out _))
            .WithMessage("Invalid TypeOfSettlement");

        RuleFor(r => r.Phone)
            .NotEmpty()
            .Matches(@"^\+?[0-9]{10,12}$")
            .WithMessage("Invalid phone");

        RuleFor(r => r.Street)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(r => r.HsApt)
            .NotEmpty()
            .MaximumLength(10);

        RuleFor(r => r.City)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(r => r.Country)
            .NotEmpty()
            .MaximumLength(30);

        RuleFor(r => r.Postcode)
            .NotEmpty()
            .MaximumLength(10);

        RuleFor(r => r.CorrStreet)
            .MaximumLength(50);

        RuleFor(r => r.CorrHsApt)
            .MaximumLength(10);

        RuleFor(r => r.CorrCity)
            .MaximumLength(30);

        RuleFor(r => r.CorrCountry)
            .MaximumLength(30);

        RuleFor(r => r.CorrPostcode)
            .MaximumLength(10);
    }
}