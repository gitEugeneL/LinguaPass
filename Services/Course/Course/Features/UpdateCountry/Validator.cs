using FastEndpoints;
using FluentValidation;

namespace Course.Features.UpdateCountry;

public sealed class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.CountryId)
            .NotEmpty()
            .Length(36);

        RuleFor(r => r.Name)
            .MinimumLength(2)
            .MaximumLength(20);
    }
}