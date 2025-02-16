namespace IdentityApi.Contracts;

public sealed record RefreshOrLogoutRequest(
    string RefreshToken,
    Guid UserId
);