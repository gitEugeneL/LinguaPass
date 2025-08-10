using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Domain.Entities;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.CreateTrack;

public class Endpoint(AppDbContext dbContext)
    : Endpoint<Request, Results<Ok<TrackResponse>, Conflict<string>, BadRequest<string>>>
{
    public const string InvalidSchool = "country is invalid";
    public const string InvalidLanguage = "language is invalid";
    public const string InvalidPrice = "price is invalid";
    public const string InvalidAdmissionFee = "admission fee is invalid";


    public override void Configure()
    {
        Post("/api/courses");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<TrackResponse>, Conflict<string>, BadRequest<string>>> ExecuteAsync(
        Request req,
        CancellationToken ct)
    {
        if (!Guid.TryParse(req.SchoolId, out var schoolId))
            return TypedResults.BadRequest(InvalidSchool);

        if (!Guid.TryParse(req.LanguageId, out var languageId))
            return TypedResults.BadRequest(InvalidLanguage);


        if (!decimal.TryParse(req.Price, out var price) || price < 1)
            return TypedResults.BadRequest(InvalidPrice);

        if (!decimal.TryParse(req.AdmissionFee, out var admissionFree) || admissionFree < 1)
            return TypedResults.BadRequest(InvalidAdmissionFee);

        var school = await dbContext
            .Schools
            .Include(s => s.Country)
            .FirstOrDefaultAsync(s => s.Id == schoolId, ct);

        if (school is null)
            return TypedResults.BadRequest(InvalidSchool);

        var language = await dbContext
            .Languages
            .FirstOrDefaultAsync(l => l.Id == languageId, ct);

        if (language is null)
            return TypedResults.BadRequest(InvalidLanguage);

        var course = new Track
        {
            Name = req.Name.Trim(),
            Description = req.Description.Trim(),
            Activities = req.Activities.Trim(),
            Duration = req.Duration.Trim(),
            Price = price,
            AdmissionFee = admissionFree,
            IsActive = req.IsActive,
            WithAccommodation = req.WithAccommodation,
            Language = language,
            School = school
        };

        await dbContext.Tracks.AddAsync(course, ct);
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(new TrackResponse(
            course.Id,
            course.Name,
            course.Description,
            course.Activities,
            course.Duration,
            course.Price,
            course.AdmissionFee,
            course.School.City,
            course.IsActive,
            course.WithAccommodation,
            course.Language.Name,
            course.School.Name,
            course.School.Country.Name,
            course.SchoolId,
            course.LanguageId
        ));
    }
}