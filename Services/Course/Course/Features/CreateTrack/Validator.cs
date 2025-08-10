using FastEndpoints;
using FluentValidation;

namespace Course.Features.CreateTrack;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.Name)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(50);

        RuleFor(r => r.Description)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(300);

        RuleFor(r => r.Duration)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(50);

        RuleFor(r => r.Activities)
            .NotEmpty()
            .MinimumLength(2)
            .MaximumLength(200);

        RuleFor(r => r.Price)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(r => r.AdmissionFee)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(r => r.IsActive)
            .NotEmpty();

        RuleFor(r => r.SchoolId)
            .NotEmpty()
            .Length(36);

        RuleFor(r => r.LanguageId)
            .Length(36);
    }
}