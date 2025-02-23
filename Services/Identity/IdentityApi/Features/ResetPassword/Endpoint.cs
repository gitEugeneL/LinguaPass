using Carter;
using IdentityApi.Contracts;
using MediatR;

namespace IdentityApi.Features.ResetPassword;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/reset-password",
            async (ResetPasswordRequest request, ISender sender, CancellationToken ct) =>
            {
                var command = new Command(request.Email, request.Code, request.Password, request.ConfirmPassword);
                var result = await sender.Send(command, ct);

                return result.Map<IResult>(
                    r => Results.Ok(new ResetPasswordResponse(r.Email, r.IsPasswordChanged)),
                    e => Results.BadRequest(e.Message)
                );
            });
    }
}