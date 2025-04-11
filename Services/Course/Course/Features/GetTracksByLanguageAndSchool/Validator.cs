using FastEndpoints;
using FluentValidation;

namespace Course.Features.GetTracksByLanguageAndSchool;

public class Validator : Validator<QueryParams>
{
    public Validator()
    {
        RuleFor(x => x.SchoolId)
            .NotEmpty()
            .WithMessage("'school Id - query param' must not be empty");

        RuleFor(x => x.LanguageId)
            .NotEmpty()
            .WithMessage("'language Id - query param' must not be empty");
    }
}