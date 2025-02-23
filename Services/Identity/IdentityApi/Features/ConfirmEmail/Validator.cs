using FluentValidation;

namespace IdentityApi.Features.ConfirmEmail;

public sealed class Validator : AbstractValidator<Command>
{
    public Validator(IConfiguration configuration)
    {
        var codeLength = int.Parse(configuration["Authentication:Code.Length"]!);

        RuleFor(c => c.Code)
            .NotEmpty()
            .Length(codeLength);

        RuleFor(c => c.Email)
            .NotEmpty()
            .EmailAddress();
    }
}