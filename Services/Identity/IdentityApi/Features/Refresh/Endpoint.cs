using Carter;
using IdentityApi.Contracts;
using IdentityApi.Utils;
using MediatR;

namespace IdentityApi.Features.Refresh;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/refresh",
            async (RefreshOrLogoutRequest request, HttpContext httpContext, ISender sender, CancellationToken ct) =>
            {
                // read refresh token (secure cookie)
                var userRefreshToken = CookieSetter.ReadCookie(httpContext);
                var command = new Command(userRefreshToken, request.UserId);
                var result = await sender.Send(command, ct);

                return result.Map<IResult>(
                    r =>
                    {
                        // set refresh token (secure cookie) 
                        CookieSetter.SetCookie(httpContext, r.RefreshToken, r.RefreshTokenExpires);

                        return Results.Ok(
                            new LoginOrRefreshResponse(
                                r.UserId,
                                r.AccessToken,
                                r.AccessTokenExpires,
                                r.RefreshTokenExpires,
                                r.IsEmailConfirmed));
                    },
                    e => Results.BadRequest(e.Message));
            });
    }
}