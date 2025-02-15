using IdentityApi.Domain.Entities;

namespace IdentityApi.Features.Refresh;

public sealed record Output(
    string AccessToken,
    RefreshToken RefreshToken,
    bool IsEmailConfirmed
);