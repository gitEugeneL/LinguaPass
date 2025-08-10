using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.UpdateTrack;

public class Endpoint(AppDbContext dbContext) : Endpoint<Request,
    Results<Ok<TrackResponse>, NotFound<string>, Conflict<string>, BadRequest<string>>>
{
    public const string InvalidTrack = "course is invalid";
    public const string InvalidPrice = "price is invalid";
    public const string InvalidAdmissionFee = "admission fee is invalid";
    public const string InvalidLanguage = "language is invalid";
    public const string InvalidData = "Nothing to change";

    public override void Configure()
    {
        Patch("/api/courses");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<TrackResponse>, NotFound<string>, Conflict<string>, BadRequest<string>>>
        ExecuteAsync(Request req, CancellationToken ct)
    {
        if (!Guid.TryParse(req.CourseId, out var trackId))
            return TypedResults.NotFound(InvalidTrack);

        var track = await dbContext
            .Tracks
            .Include(t => t.Language)
            .Include(t => t.School)
            .ThenInclude(school => school.Country)
            .FirstOrDefaultAsync(t => t.Id == trackId, ct);

        if (track is null)
            return TypedResults.NotFound(InvalidTrack);

        if (req.Name is { } name && name != track.Name)
            if (!string.IsNullOrEmpty(name) &&
                !string.Equals(track.Name, name.Trim(), StringComparison.OrdinalIgnoreCase))
                track.Name = name.Trim();

        if (req.Description is { } description && description != track.Description)
            if (!string.IsNullOrEmpty(description) && !string.Equals(track.Description, description.Trim(),
                    StringComparison.OrdinalIgnoreCase))
                track.Description = description;

        if (req.Activities is { } activities && activities != track.Activities)
            if (!string.IsNullOrEmpty(activities) && !string.Equals(track.Activities, activities.Trim(),
                    StringComparison.OrdinalIgnoreCase))
                track.Activities = activities;

        if (req.Duration is { } duration && duration != track.Duration)
            if (!string.IsNullOrEmpty(duration) && !string.Equals(track.Duration, duration.Trim(),
                    StringComparison.OrdinalIgnoreCase))
                track.Duration = duration;

        if (req.Price is { } rPrice)
        {
            if (!decimal.TryParse(rPrice, out var price) || price < 1)
                return TypedResults.BadRequest(InvalidPrice);

            if (price != track.Price)
                track.Price = price;
        }

        if (req.AdmissionFee is { } rAdmissionFee)
        {
            if (!decimal.TryParse(rAdmissionFee, out var admissionFee) || admissionFee < 1)
                return TypedResults.BadRequest(InvalidAdmissionFee);

            if (admissionFee != track.AdmissionFee)
                track.AdmissionFee = admissionFee;
        }

        if (req.IsActive is { } isActive && isActive != track.IsActive)
            track.IsActive = isActive;

        if (req.WithAccommodation is { } withAccommodation && withAccommodation != track.WithAccommodation)
            track.WithAccommodation = withAccommodation;

        if (req.LanguageId is { } rLanguageId)
        {
            if (!Guid.TryParse(rLanguageId, out var languageId))
                return TypedResults.NotFound(InvalidLanguage);

            if (languageId != track.LanguageId)
            {
                var language = await dbContext
                    .Languages
                    .FirstOrDefaultAsync(l => l.Id == languageId, ct);

                if (language is not null)
                    track.Language = language;
                else
                    return TypedResults.NotFound(InvalidLanguage);
            }
        }

        if (!dbContext.ChangeTracker.HasChanges())
            return TypedResults.BadRequest(InvalidData);

        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(new TrackResponse(
            track.Id,
            track.Name,
            track.Description,
            track.Activities,
            track.Duration,
            track.Price,
            track.AdmissionFee,
            track.School.City,
            track.IsActive,
            track.WithAccommodation,
            track.Language.Name,
            track.School.Name,
            track.School.Country.Name,
            track.SchoolId,
            track.LanguageId
        ));
    }
}