using FastEndpoints;
using FluentValidation;

namespace Course.Features.UpdateTrack;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(r => r.TrackId)
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
            .Length(20);

        RuleFor(r => r.AdmissionFee)
            .Length(20);

        RuleFor(r => r.LanguageId)
            .Length(36);
    }
}