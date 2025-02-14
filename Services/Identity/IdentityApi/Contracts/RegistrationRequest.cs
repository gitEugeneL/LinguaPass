namespace IdentityApi.Contracts;

public sealed record RegistrationRequest(
    string Email,
    string Password,
    string ConfirmPassword,
    int Age
);