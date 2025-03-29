using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace AuthConfig.Tools;

public static class TokenReader
{
    public static Guid? ReadUserId(HttpContext httpContext)
    {
        var result = Guid.TryParse(
            httpContext
                .User
                .FindFirstValue(ClaimTypes.NameIdentifier),
            out var userId
        );
        return result
            ? userId
            : null;
    }
}