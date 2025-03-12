namespace IdentityApi.Contracts;

public sealed record ResetPasswordResponse(
    string Email,
    bool IsPasswordChanged
);