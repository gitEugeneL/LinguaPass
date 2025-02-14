using IdentityApi.Domain.Entities;

namespace IdentityApi.Features.Login;

public sealed record Output(
    string AccessToken,
    RefreshToken RefreshToken,
    bool IsEmailConfirmed
);