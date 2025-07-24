using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Services.Interfaces;
using IdentityApi.Tools;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Constants = AuthConfig.Tools.Constants;

namespace IdentityApi.Features.ConfirmEmail;

public class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    ILockoutService lockoutService,
    IConfirmationService confirmationService
) : IRequestHandler<Command, Result<Output>>
{
    public const string InvalidUser = "User not found or account is locked or email is confirmed";
    public const string InvalidCode = "Invalid code";

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        var user = await dbContext
            .Users
            .Include(u => u.ConfirmationCode)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper()
                                      && u.Role.Name == Constants.CustomerRole
                                      && u.EmailConfirmed == false, ct);

        if (user?.ConfirmationCode is null || lockoutService.IsConfirmLocked(user))
            return Result<Output>.Failure(new Error(InvalidUser));

        if (lockoutService.IsConfirmAttemptLimitExceeded(user))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(new Error(InvalidUser));
        }

        if (!confirmationService.IsCodeValid(user, command.Code))
        {
            user.ConfirmFailedCount++;
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(new Error(InvalidCode));
        }

        lockoutService.ResetConfirmLockout(user);

        user.ConfirmationCode = null;
        user.EmailConfirmed = true;
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(user.Email.ToLower(), true));
    }
}