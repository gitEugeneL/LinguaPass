using IdentityApi.Utils;
using MediatR;

namespace IdentityApi.Features.Logout;

public sealed record Command(
    string? RefreshToken,
    Guid UserId
) : IRequest<Result<Output>>;