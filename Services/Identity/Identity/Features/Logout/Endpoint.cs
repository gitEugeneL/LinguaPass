using Carter;
using IdentityApi.Contracts;
using IdentityApi.Utils;
using MediatR;

namespace IdentityApi.Features.Logout;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/logout", async (RefreshOrLogoutRequest
            request, HttpContext httpContext, ISender sender, CancellationToken ct) =>
        {
            // Read refresh token (secure cookie) 
            var userRefreshToken = CookieSetter.ReadCookie(httpContext);
            var command = new Command(userRefreshToken, request.UserId);
            var result = await sender.Send(command, ct);

            return result.Map<IResult>(
                r =>
                {
                    // remove refresh token (secure cookie)
                    CookieSetter.RemoveCookie(httpContext);
                    return Results.NoContent();
                },
                e => Results.BadRequest(e.Message));
        });
    }
}