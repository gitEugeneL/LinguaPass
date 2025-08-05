using AuthConfig.Tools;
using Course.Data.Persistence;
using Course.Features.Shared;
using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetSchoolById;

public class Endpoint(
    AppDbContext dbContext
) : EndpointWithoutRequest<Results<Ok<ISchoolResponse>, BadRequest<string>, NotFound<string>>>
{
    public const string InvalidSchool = "schoolId is not found or invalid";
    public const string InvalidRole = "invalid user role";

    public override void Configure()
    {
        Get("/api/schools/{schoolId}");
        Policies(Constants.BasePolicy);
        ResponseCache(60);
    }

    public override async Task<Results<Ok<ISchoolResponse>, BadRequest<string>, NotFound<string>>> ExecuteAsync(
        CancellationToken ct)
    {
        if (!Guid.TryParse(Route<string>("schoolId"), out var schoolId))
            return TypedResults.BadRequest(InvalidSchool);

        var userRole = TokenReader.ReadUserRole(HttpContext);
        if (userRole is null)
            return TypedResults.BadRequest(InvalidRole);


        var query = dbContext.Schools.AsNoTracking().Where(s => s.Id == schoolId);

        if (userRole == Constants.CustomerRole)
            query = query.Where(s => s.IsActive);

        var response = await query
            .Select(s => userRole == Constants.AdminRole
                ? (ISchoolResponse)
                new SchoolAdminResponse(
                    s.Id,
                    s.Name,
                    s.ShortName,
                    s.City,
                    s.IsActive,
                    s.CountryId,
                    s.Tracks.Count,
                    s.Languages.Select(l => new BaseLanguageResponse(l.Id, l.Name))
                )
                : new SchoolResponse(
                    s.Id,
                    s.Name,
                    s.City,
                    s.IsActive,
                    s.CountryId)
            )
            .Cast<ISchoolResponse>()
            .FirstOrDefaultAsync(ct);

        return response is not null
            ? TypedResults.Ok(response)
            : TypedResults.NotFound(InvalidSchool);
    }
}