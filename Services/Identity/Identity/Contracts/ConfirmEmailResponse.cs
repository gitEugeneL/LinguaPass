namespace IdentityApi.Contracts;

public sealed record ConfirmEmailResponse(
    string Email,
    bool IsEmailConfirmed
);