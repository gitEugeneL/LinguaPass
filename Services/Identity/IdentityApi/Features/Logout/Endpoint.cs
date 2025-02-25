using Carter;
using IdentityApi.Contracts;
using MediatR;

namespace IdentityApi.Features.Logout;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/logout", async (RefreshOrLogoutRequest
            request, ISender sender, CancellationToken ct) =>
        {
            var command = new Command(request.RefreshToken, request.UserId);
            var result = await sender.Send(command, ct);
            return result.Map<IResult>(
                r => Results.NoContent(),
                e => Results.BadRequest(e.Message));
        });
    }
}