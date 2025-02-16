using IdentityApi.Utils;
using MediatR;

namespace IdentityApi.Features.Registration;

public record Command(
    string Email,
    string Password,
    string ConfirmPassword,
    int Age
) : IRequest<Result<Output>>;