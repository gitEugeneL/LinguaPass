using Carter;
using IdentityApi.Contracts;
using IdentityApi.Utils.CustomResult;
using MediatR;

namespace IdentityApi.Features.Registration;

public class RegistrationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/registration", async (RegistrationRequest request, ISender sender, CancellationToken ct) =>
        {
            var command = new RegistrationCommand(
                request.ClientUri,
                request.Email,
                request.Password,
                request.ConfirmPassword,
                request.Age
            );
            var result = await sender.Send(command, ct);

            return result.Map<IResult>(
                r => Results.Ok(new RegistrationResponse(r.UserId)),
                e => e switch
                {
                    ValidationError => Results.UnprocessableEntity(e.Message),
                    AuthenticationError => Results.BadRequest(e.Message),
                    _ => Results.Problem("An unexpected error occurred.")
                });
        });
    }
}