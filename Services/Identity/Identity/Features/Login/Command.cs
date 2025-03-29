using IdentityApi.Tools;
using MediatR;

namespace IdentityApi.Features.Login;

public sealed record Command(
    string Email,
    string Password
) : IRequest<Result<Output>>;