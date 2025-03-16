using FluentValidation;

namespace Course.Features.GetLanguages;

public sealed class Validator : AbstractValidator<Query>
{
    public Validator()
    {
        RuleFor(q => q.Filter)
            .NotNull()
            .IsInEnum()
            .WithMessage($"Allowed values: {string.Join(", ", Enum.GetNames<QueryFilter>())}");
    }
}