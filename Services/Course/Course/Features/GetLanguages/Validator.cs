using Course.Features.GetLanguages;
using FastEndpoints;
using FluentValidation;

namespace Course.RestFeatures.GetLanguages;

public class Validator : Validator<QueryParams>
{
    public Validator()
    {
        RuleFor(x => x.Filter)
            .Must(filter => string.IsNullOrEmpty(filter) || Enum.TryParse<QueryFilter>(filter, true, out _))
            .WithMessage($"Allowed values: {string.Join(", ", Enum.GetNames<QueryFilter>())}");
    }
}