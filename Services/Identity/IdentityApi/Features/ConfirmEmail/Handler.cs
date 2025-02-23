using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Services.Interfaces;
using IdentityApi.Utils;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.ConfirmEmail;

internal class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    IConfirmationService confirmationService
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
                                      && u.EmailConfirmed == false, ct);

        if (user?.ConfirmationCode is null || confirmationService.IsConfirmLocked(user))
            return Result<Output>.Failure(
                Error.AuthenticationError("User not found or email is confirmed or account is locked"));

        if (confirmationService.IsConfirmAttemptLimitExceeded(user))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("Too many login attempts"));
        }

        if (user.ConfirmationCode.Code != command.Code || user.ConfirmationCode.Expires < DateTime.UtcNow)
        {
            user.ConfirmFailedCount++;
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("Invalid code"));
        }

        confirmationService.ResetConfirmLockout(user);

        user.ConfirmationCode = null;
        user.EmailConfirmed = true;
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(user.Email, true));
    }
}