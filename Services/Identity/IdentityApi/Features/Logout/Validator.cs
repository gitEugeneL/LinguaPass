using FluentValidation;

namespace IdentityApi.Features.Logout;

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(c => c.RefreshToken)
            .NotEmpty()
            .WithMessage("Refresh token is required (Secure cookie)");

        RuleFor(c => c.UserId)
            .NotEmpty();
    }
}