using FastEndpoints;
using FluentValidation;

namespace Account.Features.GetAccounts;

public class Validator : Validator<QueryParams>
{
    public Validator()
    {
        RuleFor(r => r.PageNumber)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page number must be greater than or equal to 1");

        RuleFor(r => r.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("Page size must be between 1 and 50");

        RuleFor(r => r.IsActive)
            .NotNull();
    }
}