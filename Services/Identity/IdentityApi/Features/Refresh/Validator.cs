using FluentValidation;

namespace IdentityApi.Features.Refresh;

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(c => c.RefreshToken)
            .NotEmpty();

        RuleFor(c => c.UserId)
            .NotEmpty();
    }
}