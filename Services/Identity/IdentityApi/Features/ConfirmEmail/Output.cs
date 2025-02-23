namespace IdentityApi.Features.ConfirmEmail;

public sealed record Output(
    string Email,
    bool IsEmailConfirmed
);