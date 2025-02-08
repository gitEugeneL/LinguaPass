namespace IdentityApi.Contracts;

public sealed record RegistrationRequest(
    string ClientUri,
    string Email,
    string Password,
    string ConfirmPassword,
    int Age
);