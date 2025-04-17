using Common.GrpcProtos;

namespace Account.Grpc.Clients;

public class CourseClient(Courses.CoursesClient client)
{
    public async Task<bool?> CheckLanguage(Guid languageId)
    {
        try
        {
            var request = new CheckLanguageRequest
            {
                LanguageId = languageId.ToString()
            };
            var response = await client.CheckLanguageExistsAsync(request);
            return response.LanguageExists;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<bool?> CheckSchool(Guid languageId, Guid schoolId)
    {
        try
        {
            var request = new CheckSchoolRequest
            {
                LanguageId = languageId.ToString(),
                SchoolId = schoolId.ToString()
            };
            var response = await client.CheckSchoolExistsAsync(request);
            return response.SchoolExists;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public async Task<bool?> CheckCourse(Guid languageId, Guid schoolId, Guid courseId)
    {
        try
        {
            var request = new CheckCourseRequest
            {
                LanguageId = languageId.ToString(),
                SchoolId = schoolId.ToString(),
                CourseId = courseId.ToString()
            };
            var response = await client.CheckCourseExistsAsync(request);
            return response.CourseExists;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}