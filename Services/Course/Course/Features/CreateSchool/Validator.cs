using FastEndpoints;
using FluentValidation;

namespace Course.Features.CreateSchool;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.CountryId)
            .NotEmpty()
            .Length(36);

        RuleFor(r => r.Name)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(100);

        RuleFor(r => r.ShortName)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(10);

        RuleFor(r => r.City)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(20);

        RuleFor(r => r.LanguageIds)
            .NotEmpty()
            .ForEach(id => id
                .Length(36));
    }
}