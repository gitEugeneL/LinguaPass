namespace IdentityApi.Tools;

public static class CookieSetter
{
    public const string RefreshCookie = "refreshToken";

    public static void SetCookie(HttpContext context, string refreshToken, DateTime expires)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = expires
        };
        context.Response.Cookies.Append(RefreshCookie, refreshToken, cookieOptions);
    }

    public static string? ReadCookie(HttpContext context)
    {
        context.Request.Cookies.TryGetValue(RefreshCookie, out var refreshToken);
        return refreshToken;
    }

    public static void RemoveCookie(HttpContext context)
    {
        context.Response.Cookies.Delete(RefreshCookie);
    }
}