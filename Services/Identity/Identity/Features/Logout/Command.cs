using IdentityApi.Tools;
using MediatR;

namespace IdentityApi.Features.Logout;

public sealed record Command(
    string? RefreshToken,
    Guid UserId,
    string ClientRole
) : IRequest<Result<Output>>;