using Common.GrpcProtos;
using Course.Data.Persistence;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;

namespace Course.Grpc.Servers;

public class CourseServer(AppDbContext dbContext) : Courses.CoursesBase
{
    public const string InvalidLanguage = "Invalid LanguageId format";
    public const string InvalidSchool = "Invalid schoolId format";

    public override async Task<CheckLanguageResponse> CheckLanguageExists(
        CheckLanguageRequest request,
        ServerCallContext context)
    {
        if (!Guid.TryParse(request.LanguageId, out var parseId))
            throw new RpcException(new Status(StatusCode.Unavailable, InvalidLanguage));

        var result = await dbContext
            .Languages
            .AsNoTracking()
            .AnyAsync(l => l.Id == parseId && l.IsActive);

        return new CheckLanguageResponse { LanguageExists = result };
    }

    public override async Task<CheckSchoolResponse> CheckSchoolExists(
        CheckSchoolRequest request,
        ServerCallContext context)
    {
        if (!Guid.TryParse(request.LanguageId, out var parseLanguageId))
            throw new RpcException(new Status(StatusCode.Unavailable, InvalidLanguage));

        if (!Guid.TryParse(request.SchoolId, out var parseSchoolId))
            throw new RpcException(new Status(StatusCode.Unavailable, InvalidSchool));

        var result = await dbContext
            .Schools
            .Include(s => s.Languages)
            .AsNoTracking()
            .AnyAsync(s =>
                s.Id == parseSchoolId &&
                s.IsActive &&
                s.Languages
                    .Any(l => l.Id == parseLanguageId && l.IsActive));

        return new CheckSchoolResponse { SchoolExists = result };
    }
}