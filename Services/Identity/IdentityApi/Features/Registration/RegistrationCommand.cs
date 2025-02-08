using IdentityApi.Utils.CustomResult;
using MediatR;

namespace IdentityApi.Features.Registration;

public record RegistrationCommand(
    string ClientUri,
    string Email,
    string Password,
    string ConfirmPassword,
    int Age
) : IRequest<Result<RegistrationResult>>;