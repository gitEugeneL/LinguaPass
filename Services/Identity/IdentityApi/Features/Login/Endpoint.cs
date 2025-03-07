using Carter;
using IdentityApi.Contracts;
using IdentityApi.Utils;
using MediatR;

namespace IdentityApi.Features.Login;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/login",
            async (LoginRequest request, ISender sender, HttpContext httpContext, CancellationToken ct) =>
            {
                var command = new Command(request.Email, request.Password);
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