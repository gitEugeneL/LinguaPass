namespace IdentityApi.Contracts;

public sealed record ResetPasswordRequest(
    string Email,
    string Code,
    string Password,
    string ConfirmPassword
);