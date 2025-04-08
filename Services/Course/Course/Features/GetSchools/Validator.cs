using FastEndpoints;
using FluentValidation;

namespace Course.Features.GetSchools;

public class Validator : Validator<QueryParams>
{
    public Validator()
    {
        RuleFor(x => x.CountryId)
            .NotEmpty()
            .WithMessage("'country Id - query param' must not be empty");
    }
}