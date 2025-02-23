using IdentityApi.Domain.Entities;

namespace IdentityApi.Services.Interfaces;

public interface IConfirmationService
{
    bool IsLoginLocked(User user);

    bool IsConfirmLocked(User user);

    void ResetLoginLockout(User user);

    void ResetConfirmLockout(User user);

    bool IsLoginAttemptLimitExceeded(User user);

    bool IsConfirmAttemptLimitExceeded(User user);

    bool IsGenerateCodeAttemptLimitExceeded(User user);
}