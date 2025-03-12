using FluentValidation;

namespace IdentityApi.Features.GenerateCode;

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(c => c.Email)
            .NotEmpty()
            .EmailAddress();
    }
}