using IdentityApi.Helpers;
using MediatR;

namespace IdentityApi.Features.ConfirmEmail;

public sealed record Command(
    string Code,
    string Email
) : IRequest<Result<Output>>;