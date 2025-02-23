using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Services.Interfaces;
using IdentityApi.Utils;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.ResetPassword;

internal class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    IConfirmationService confirmationService,
    ISecurityService securityService,
    IPasswordService passwordService
) : IRequestHandler<Command, Result<Output>>
{
    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(Error.ValidationError(validationResult.GetValidationProblems()));

        var user = await dbContext
            .Users
            .Include(u => u.ConfirmationCode)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper()
                                      && u.EmailConfirmed == true, ct);

        if (user is null || confirmationService.IsConfirmLocked(user))
            return Result<Output>.Failure(Error.AuthenticationError("User not found or account is locked"));

        if (confirmationService.IsConfirmAttemptLimitExceeded(user))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("Too many reset password attempts"));
        }

        if (!securityService.IsCodeValid(user, command.Code))
        {
            user.ConfirmFailedCount++;
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("User not found or code is invalid"));
        }

        confirmationService.ResetConfirmLockout(user);

        passwordService.CreatePasswordHash(command.Password, out var passwordHash, out var passwordSalt);
        user.PwdHash = passwordHash;
        user.PwdSalt = passwordSalt;
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(user.Email.ToLower(), true));
    }
}