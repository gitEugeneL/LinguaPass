namespace IdentityApi.Contracts;

public sealed record ConfirmEmailRequest(
    string Code,
    string Email
);