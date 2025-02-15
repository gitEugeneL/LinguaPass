namespace IdentityApi.Contracts;

public sealed record RefreshRequest(
    string RefreshToken,
    Guid UserId
);