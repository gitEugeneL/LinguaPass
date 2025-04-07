using FastEndpoints;
using FluentValidation;

namespace Course.Features.GetCountries;

public class Validator : Validator<QueryParams>
{
    public Validator()
    {
        RuleFor(x => x.LanguageId)
            .NotEmpty()
            .WithMessage("'language Id - query param' must not be empty");
    }
}