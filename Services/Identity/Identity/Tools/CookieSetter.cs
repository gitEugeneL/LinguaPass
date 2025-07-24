namespace IdentityApi.Tools;

public static class CookieSetter
{
    public const string AdminRefreshCookieName = "refreshTokenManager";
    public const string CustomerRefreshCookieName = "refreshTokenCustomer";

    public static string GetRefreshCookieName(string roleName)
    {
        return roleName == Constants.Admin.Name ? AdminRefreshCookieName : CustomerRefreshCookieName;
    }

    public static void SetCookie(HttpContext context, string refreshToken, DateTime expires, string clientRole)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = expires
        };
        context.Response.Cookies.Append(GetRefreshCookieName(clientRole), refreshToken, cookieOptions);
    }

    public static string? ReadCookie(HttpContext context, string clientRole)
    {
        context.Request.Cookies.TryGetValue(GetRefreshCookieName(clientRole), out var refreshToken);
        return refreshToken;
    }

    public static void RemoveCookie(HttpContext context, string clientRole)
    {
        context.Response.Cookies.Delete(GetRefreshCookieName(clientRole));
    }
}