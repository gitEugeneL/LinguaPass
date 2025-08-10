using FastEndpoints;
using FluentValidation;

namespace Course.Features.UpdateTrack;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.CourseId)
            .NotEmpty()
            .Length(36);

        RuleFor(r => r.Name)
            .MinimumLength(2)
            .MaximumLength(50);

        RuleFor(r => r.Description)
            .MinimumLength(2)
            .MaximumLength(300);

        RuleFor(r => r.Duration)
            .MinimumLength(2)
            .MaximumLength(50);

        RuleFor(r => r.Activities)
            .MinimumLength(2)
            .MaximumLength(200);

        RuleFor(r => r.Price)
            .MaximumLength(20);

        RuleFor(r => r.AdmissionFee)
            .MaximumLength(20);

        RuleFor(r => r.LanguageId)
            .Length(36);
    }
}