using Carter;
using IdentityApi.Contracts;
using MediatR;

namespace IdentityApi.Features.Registration;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/registration", async (RegistrationRequest request, ISender sender, CancellationToken ct) =>
        {
            var command = new Command(
                request.Email,
                request.Password,
                request.ConfirmPassword,
                request.Age
            );
            var result = await sender.Send(command, ct);
            return result.Map<IResult>(
                r => Results.Ok(r.UserId),
                e => Results.BadRequest(e.Message)
            );
        });
    }
}