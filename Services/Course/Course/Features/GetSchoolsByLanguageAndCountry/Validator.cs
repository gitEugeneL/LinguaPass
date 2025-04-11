using FastEndpoints;
using FluentValidation;

namespace Course.Features.GetSchoolsByLanguageAndCountry;

public class Validator : Validator<QueryParams>
{
    public Validator()
    {
        RuleFor(x => x.CountryId)
            .NotEmpty()
            .WithMessage("'country Id - query param' must not be empty");

        RuleFor(x => x.LanguageId)
            .NotEmpty()
            .WithMessage("'language Id - query param' must not be empty");
    }
}