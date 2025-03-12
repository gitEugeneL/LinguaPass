namespace IdentityApi.Features.GenerateCode;

public sealed record Output(
    string Email,
    DateTime CodeExpires
);