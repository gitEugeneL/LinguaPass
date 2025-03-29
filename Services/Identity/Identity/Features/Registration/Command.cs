using IdentityApi.Tools;
using MediatR;

namespace IdentityApi.Features.Registration;

public record Command(
    string Email,
    string Password,
    string ConfirmPassword
) : IRequest<Result<Output>>;