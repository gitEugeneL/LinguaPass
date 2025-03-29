using Carter;
using IdentityApi.Contracts;
using MediatR;

namespace IdentityApi.Features.GenerateCode;

public class Endpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/generate-code",
            async (GenerateCodeRequest request, ISender sender, CancellationToken ct) =>
            {
                var command = new Command(request.Email);

                var result = await sender.Send(command, ct);
                return result.Map<IResult>(
                    r => Results.Ok(new GenerateCodeResponse(r.Email, r.CodeExpires)),
                    e => Results.BadRequest(e.Message)
                );
            });
    }
}