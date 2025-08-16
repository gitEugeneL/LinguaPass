using AuthConfig.Tools;
using Course.Data.Persistence;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.DeleteSchool;

public class Endpoint(AppDbContext dbContext) : EndpointWithoutRequest<Results<NoContent, BadRequest<string>>>
{
    public const string InvalidSchool = "SchoolId is invalid";
    public const string InvalidDelete = "Cannot delete, it has active courses";

    public override void Configure()
    {
        Delete("/api/schools/{schoolId}");
        Policies(Constants.AdminPolicy);
    }

    public override async Task<Results<NoContent, BadRequest<string>>> ExecuteAsync(CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("schoolId"), out var schoolId))
            return TypedResults.BadRequest(InvalidSchool);

        var school = await dbContext
            .Schools
            .Include(s => s.Tracks)
            .FirstOrDefaultAsync(s => s.Id == schoolId, ct);

        if (school is null)
            return TypedResults.BadRequest(InvalidSchool);

        if (school.Tracks.Any(t => t.IsActive))
            return TypedResults.BadRequest(InvalidDelete);

        dbContext.Schools.Remove(school);
        await dbContext.SaveChangesAsync(ct);

        return TypedResults.NoContent();
    }
}