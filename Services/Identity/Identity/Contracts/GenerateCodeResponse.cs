namespace IdentityApi.Contracts;

public sealed record GenerateCodeResponse(
    string Email,
    DateTime CodeExpires
);