using IdentityApi.Helpers;
using MediatR;

namespace IdentityApi.Features.Refresh;

public sealed record Command(
    string? RefreshToken,
    Guid UserId
) : IRequest<Result<Output>>;