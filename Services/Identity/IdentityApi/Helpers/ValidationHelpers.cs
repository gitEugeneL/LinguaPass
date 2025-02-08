using FluentValidation;
using ValidationResult = FluentValidation.Results.ValidationResult;

namespace IdentityApi.Helpers;

public static class ValidationHelper
{
    public static async Task<ValidationResult> ValidateAsync<T>(
        IValidator<T> validator,
        T command,
        CancellationToken ct)
    {
        return await validator.ValidateAsync(command, ct);
    }
}