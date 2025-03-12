using Carter;
using IdentityApi.Contracts;
using MediatR;

namespace IdentityApi.Features.ConfirmEmail;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/confirm-email", async (ConfirmEmailRequest request, ISender sender, CancellationToken ct) =>
        {
            var command = new Command(request.Code, request.Email);
            var result = await sender.Send(command, ct);

            return result.Map<IResult>(
                r => Results.Ok(new ConfirmEmailResponse(r.Email, r.IsEmailConfirmed)),
                e => Results.BadRequest(e.Message)
            );
        });
    }
}