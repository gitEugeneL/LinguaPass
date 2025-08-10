using FastEndpoints;
using FluentValidation;

namespace Course.Features.UpdateSchool;

public sealed class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.SchoolId)
            .NotEmpty()
            .Length(36);

        RuleFor(r => r.Name)
            .MinimumLength(2)
            .MaximumLength(100);

        RuleFor(r => r.ShortName)
            .MinimumLength(2)
            .MaximumLength(10);

        RuleFor(r => r.City)
            .MinimumLength(2)
            .MaximumLength(20);

        RuleFor(r => r.LanguageIds)
            .NotEmpty()
            .ForEach(id => id
                .Length(36));
    }
}