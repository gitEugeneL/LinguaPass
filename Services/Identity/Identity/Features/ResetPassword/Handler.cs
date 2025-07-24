using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Services.Interfaces;
using IdentityApi.Tools;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Constants = AuthConfig.Tools.Constants;


namespace IdentityApi.Features.ResetPassword;

public class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    ILockoutService lockoutService,
    IConfirmationService confirmationService,
    IPasswordService passwordService
) : IRequestHandler<Command, Result<Output>>
{
    public const string InvalidUser = "User not found or account is locked";

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
                                      && u.EmailConfirmed == true, ct);

        if (user is null || lockoutService.IsConfirmLocked(user))
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
            return Result<Output>.Failure(new Error(InvalidUser));
        }

        lockoutService.ResetConfirmLockout(user);

        passwordService.CreatePasswordHash(command.Password, out var passwordHash, out var passwordSalt);
        user.PwdHash = passwordHash;
        user.PwdSalt = passwordSalt;
        user.ConfirmationCode = null;
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(user.Email.ToLower(), true));
    }
}