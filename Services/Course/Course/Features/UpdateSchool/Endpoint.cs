using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.UpdateSchool;

public class Endpoint(AppDbContext dbContext)
    : Endpoint<Request, Results<Ok<SchoolAdminResponse>, NotFound<string>, Conflict<string>, BadRequest<string>>>
{
    public const string InvalidSchoolId = "school is invalid";
    public const string InvalidName = "This name already exists";
    public const string InvalidShortName = "This short name already exists";
    public const string InvalidLanguageId = "one or more languages are invalid";
    public const string InvalidData = "Nothing to change";

    public override void Configure()
    {
        Patch("/api/schools");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<Ok<SchoolAdminResponse>, NotFound<string>, Conflict<string>, BadRequest<string>>>
        ExecuteAsync(Request req, CancellationToken ct)
    {
        if (!Guid.TryParse(req.SchoolId, out var schoolId))
            return TypedResults.NotFound(InvalidSchoolId);

        var school = await dbContext
            .Schools
            .Include(s => s.Languages)
            .Include(school => school.Tracks)
            .FirstOrDefaultAsync(s => s.Id == schoolId, ct);

        if (school is null)
            return TypedResults.NotFound(InvalidSchoolId);

        if (req.Name is { } name && name != school.Name)
        {
            if (await dbContext.Schools.AsNoTracking().AnyAsync(s => s.Name.ToLower() == name.ToLower().Trim(), ct))
                return TypedResults.Conflict(InvalidName);

            if (!string.IsNullOrEmpty(name) &&
                !string.Equals(school.Name, name.Trim(), StringComparison.OrdinalIgnoreCase))
                school.Name = name.Trim();
        }

        if (req.ShortName is { } shortName && shortName != school.ShortName)
        {
            if (await dbContext.Schools.AsNoTracking()
                    .AnyAsync(s => s.ShortName.ToLower() == shortName.ToLower().Trim(), ct))
                return TypedResults.Conflict(InvalidShortName);

            if (!string.IsNullOrEmpty(shortName) &&
                !string.Equals(school.ShortName, shortName.Trim(), StringComparison.OrdinalIgnoreCase))
                school.ShortName = shortName.Trim();
        }

        if (req.City is { } city && city != school.City)
            school.City = city.Trim();

        if (req.IsActive is { } isActive && isActive != school.IsActive)
            school.IsActive = isActive;

        var currentLanguageIds = school.Languages.Select(l => l.Id).ToHashSet();

        var requestedLanguageIds = req.LanguageIds
            .Select(id => Guid.TryParse(id, out var guid) ? guid : (Guid?)null)
            .Where(id => id.HasValue)
            .Select(id => id.Value)
            .ToHashSet();

        if (!currentLanguageIds.SetEquals(requestedLanguageIds))
        {
            var languages = await dbContext
                .Languages
                .Where(l => requestedLanguageIds.Contains(l.Id))
                .ToListAsync(ct);

            if (languages.Count != requestedLanguageIds.Count)
                return TypedResults.BadRequest(InvalidLanguageId);

            school.Languages = languages;
        }

        if (!dbContext.ChangeTracker.HasChanges())
            return TypedResults.BadRequest(InvalidData);

        await dbContext.SaveChangesAsync(ct);

        return TypedResults.Ok(
            new SchoolAdminResponse(
                school.Id,
                school.Name,
                school.ShortName,
                school.City,
                school.IsActive,
                school.CountryId,
                school.Tracks.Count,
                school.Languages.Select(l => new BaseLanguageResponse(l.Id, l.Name))
            )
        );
    }
}