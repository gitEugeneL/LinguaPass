using Carter;
using IdentityApi.Contracts;
using IdentityApi.Tools;
using MediatR;

namespace IdentityApi.Features.Refresh;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/refresh",
            async (RefreshOrLogoutRequest request, HttpContext httpContext, ISender sender, CancellationToken ct) =>
            {
                // read refresh token (secure cookie)
                var userRefreshToken = CookieSetter.ReadCookie(httpContext, request.ClientRole);
                var command = new Command(userRefreshToken, request.UserId, request.ClientRole);
                var result = await sender.Send(command, ct);

                return result.Map<IResult>(
                    r =>
                    {
                        // set refresh token (secure cookie) 
                        CookieSetter.SetCookie(httpContext, r.RefreshToken, r.RefreshTokenExpires, r.Role.Name);

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