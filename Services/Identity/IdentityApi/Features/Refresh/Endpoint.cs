using Carter;
using IdentityApi.Contracts;
using MediatR;

namespace IdentityApi.Features.Refresh;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/refresh", async (RefreshRequest request, ISender sender, CancellationToken ct) =>
        {
            var command = new Command(request.RefreshToken, request.UserId);
            var result = await sender.Send(command, ct);

            return result.Map<IResult>(
                r => Results.Ok(new LoginOrRefreshResponse(r.AccessToken, r.RefreshToken, r.IsEmailConfirmed)),
                e => Results.BadRequest(e.Message)
            );
        });
    }
}