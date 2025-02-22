using System.Security.Claims;

namespace IdentityApi.Services;

public static class TokenService
{
    public static Guid ReadUserIdFromToken(HttpContext httpContext)
    {
        return Guid.Parse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    public static bool ReadIsEmailConfirmedFromToken(HttpContext httpContext)
    {
        return bool.Parse(httpContext.User.FindFirstValue("isEmailConfirmed")!);
    }
}