using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using IdentityApi.Utils;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.GenerateCode;

internal class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    ISecurityService securityService,
    IConfiguration configuration
) : IRequestHandler<Command, Result<Output>>
{
    private readonly int _lockoutMinutes =
        int.Parse(configuration["Authentication:ConfirmLockout.Lifetime.Minutes"]!);

    private readonly int _maxAttempts =
        int.Parse(configuration["Authentication:Code.Generate.MaxAttempts"]!);

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(Error.ValidationError(validationResult.GetValidationProblems()));

        var user = await dbContext
            .Users
            .Include(u => u.ConfirmationCode)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper(), ct);

        if (user is null || IsAccountLocked(user))
            return Result<Output>.Failure(Error.AuthenticationError("User is not found or account is locked"));

        if (IsAttemptLimitExceeded(user, _maxAttempts, _lockoutMinutes))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("Too many code generation attempts"));
        }

        var confirmationCode = user.ConfirmationCode;
        var (code, expires) = securityService.GenerateCode(user);

        if (confirmationCode is null)
        {
            confirmationCode = new ConfirmationCode
            {
                Code = code,
                Expires = expires,
                User = user
            };
            await dbContext.ConfirmationCodes.AddAsync(confirmationCode, ct);
        }
        else
        {
            confirmationCode.Code = code;
            confirmationCode.Expires = expires;
        }

        await dbContext.SaveChangesAsync(ct);

        // todo send email ---------------------------------------------

        return Result<Output>.Success(new Output(user.Email.ToLower(), expires));
    }

    private static bool IsAttemptLimitExceeded(User user, int maxAttempts, int lockoutMinutes)
    {
        user.GenerateCodeCount++;

        if (user.GenerateCodeCount <= maxAttempts)
            return false;

        user.ConfirmLocked = true;
        user.ConfirmLockExpires = DateTime.UtcNow.AddMinutes(lockoutMinutes);
        return true;
    }

    private static bool IsAccountLocked(User user)
    {
        switch (user.ConfirmLocked)
        {
            case true when user.ConfirmLockExpires >= DateTime.UtcNow:
                return true;

            case true when user.ConfirmLockExpires < DateTime.UtcNow:
                user.ConfirmLocked = false;
                user.ConfirmLockExpires = null;
                user.GenerateCodeCount = 0;
                break;
        }

        return false;
    }
}