namespace IdentityApi.Features.ResetPassword;

public sealed record Output(string Email, bool IsPasswordChanged);