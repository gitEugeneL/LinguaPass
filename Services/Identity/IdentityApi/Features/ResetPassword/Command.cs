using IdentityApi.Helpers;
using MediatR;

namespace IdentityApi.Features.ResetPassword;

public record Command(
    string Email,
    string Code,
    string Password,
    string ConfirmPassword
) : IRequest<Result<Output>>;