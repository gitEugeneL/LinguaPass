using Course.Data.Persistence;
using Course.Domain.Entities;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.CreateSchool;

public class Endpoint(AppDbContext dbContext)
    : Endpoint<Request, Results<Ok<SchoolAdminResponse>, Conflict<string>, BadRequest<string>>>
{
    public const string InvalidCountryId = "country is invalid";
    public const string InvalidLanguageId = "one or more languages are invalid";
    public const string ConflictName = "This name already exists";
    public const string ConflictShortName = "This short name already exists";

    public override void Configure()
    {
        Post("/api/schools");
        Policies();
    }

    public override async Task<Results<Ok<SchoolAdminResponse>, Conflict<string>, BadRequest<string>>> ExecuteAsync(
        Request req,
        CancellationToken ct)
    {
        if (!Guid.TryParse(req.CountryId, out var countryId))
            return TypedResults.BadRequest(InvalidCountryId);

        if (req.LanguageIds.Any(id => !Guid.TryParse(id, out _)))
            return TypedResults.BadRequest(InvalidLanguageId);

        var country = await dbContext
            .Countries
            .FirstOrDefaultAsync(c => c.Id == countryId, ct);

        if (country is null)
            return TypedResults.BadRequest(InvalidCountryId);

        if (await dbContext.Schools.AsNoTracking()
                .AnyAsync(s => s.Name.ToLower() == req.Name.ToLower().Trim(), ct))
            return TypedResults.Conflict(ConflictName);

        if (await dbContext.Schools.AsNoTracking()
                .AnyAsync(s => s.ShortName.ToLower() == req.ShortName.ToLower().Trim(), ct))
            return TypedResults.Conflict(ConflictShortName);

        var languageIds = req.LanguageIds.Select(Guid.Parse).ToList();
        var languages = await dbContext
            .Languages
            .Where(l => languageIds.Contains(l.Id))
            .ToListAsync(ct);

        if (languages.Count != languageIds.Count)
            return TypedResults.BadRequest(InvalidLanguageId);

        var school = new School
        {
            Name = req.Name.Trim(),
            ShortName = req.ShortName.Trim(),
            City = req.City.Trim(),
            IsActive = true,
            Country = country,
            Languages = languages
        };

        await dbContext.Schools.AddAsync(school, ct);
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(
            new SchoolAdminResponse(
                school.Id,
                school.Name,
                school.ShortName,
                school.City,
                school.Country.Name,
                school.IsActive,
                school.CountryId,
                school.Tracks.Count,
                languages.Select(l => new BaseLanguageResponse(l.Id, l.Name))
            )
        );
    }
}