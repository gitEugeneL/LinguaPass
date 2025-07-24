namespace IdentityApi.Contracts;

public sealed record RefreshOrLogoutRequest(
    Guid UserId,
    string ClientRole
);