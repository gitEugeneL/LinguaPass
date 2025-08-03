using FastEndpoints;
using FluentValidation;

namespace Course.Features.CreateCountry;

public sealed class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.Name)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(20);
    }
}