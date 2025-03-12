using FluentValidation;

namespace IdentityApi.Features.Login;

public sealed class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(c => c.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(c => c.Password)
            .NotEmpty()
            .MinimumLength(8);
    }
}