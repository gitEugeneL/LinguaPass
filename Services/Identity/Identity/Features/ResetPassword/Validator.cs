using FluentValidation;

namespace IdentityApi.Features.ResetPassword;

public class Validator : AbstractValidator<Command>
{
    public Validator(IConfiguration configuration)
    {
        var codeLength = int.Parse(configuration["Authentication:Code.Length"]!);

        RuleFor(c => c.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(c => c.Code)
            .NotEmpty()
            .Length(codeLength);

        RuleFor(command => command.Password)
            .NotEmpty()
            .Length(8, 20)
            .WithMessage("Password must be between 8 and 20 characters")
            .Must(p => p.Any(char.IsLetter))
            .WithMessage("Password must contain letters")
            .Must(p => p.Any(char.IsUpper))
            .WithMessage("Password must contain upper case")
            .Must(p => p.Any(char.IsDigit))
            .WithMessage("Password must contain digits")
            .Must(p => p.Any(c => !char.IsLetterOrDigit(c)))
            .WithMessage("Password must contain special characters");

        RuleFor(command => command.ConfirmPassword)
            .NotEmpty()
            .Equal(command => command.Password)
            .WithMessage("Passwords do not match");
    }
}