using Carter;
using IdentityApi.Contracts;
using MediatR;

namespace IdentityApi.Features.Login;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/login", async (LoginRequest request, ISender sender, CancellationToken ct) =>
        {
            var command = new Command(request.Email, request.Password);
            var result = await sender.Send(command, ct);

            return result.Map<IResult>(
                r => Results.Ok(new LoginResponse(r.AccessToken, r.RefreshToken, r.IsEmailConfirmed)),
                e => Results.BadRequest(e.Message)
            );
        });
    }
}