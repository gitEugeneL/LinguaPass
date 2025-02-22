using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using IdentityApi.Utils;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.Login;

internal class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    IPasswordService passwordService,
    ISecurityService securityService,
    IConfiguration configuration
) : IRequestHandler<Command, Result<Output>>
{
    private readonly int _loginLockoutMinutes =
        int.Parse(configuration["Authentication:LoginLockout.Lifetime.Minutes"]!);

    private readonly int _maxLoginAttempts = int.Parse(configuration["Authentication:LoginLockout.MaxAttempts"]!);
    private readonly int _refreshTokenMaxCount = int.Parse(configuration["Authentication:RefreshToken.MaxCount"]!);

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(Error.ValidationError(validationResult.GetValidationProblems()));

        var user = await dbContext
            .Users
            .Include(u => u.RefreshTokens)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper(), ct);


        if (user is null || IsAccountLocked(user))
            return Result<Output>.Failure(
                Error.AuthenticationError("login or password is incorrect or account is locked"));


        if (IsAttemptLimitExceeded(user, _maxLoginAttempts, _loginLockoutMinutes))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("Too many login attempts"));
        }

        if (!passwordService.VerifyPasswordHash(command.Password, user.PwdHash, user.PwdSalt))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(
                Error.AuthenticationError("login or password is incorrect or account is locked"));
        }

        if (user.RefreshTokens.Count >= _refreshTokenMaxCount)
            user.RefreshTokens.Remove(user.RefreshTokens.OrderBy(rt => rt.Expires).First());

        var accessToken = securityService.GenerateAccessToken(user);
        var refreshToken = securityService.GenerateRefreshToken(user);

        user.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(
            new Output(
                accessToken.token,
                refreshToken.Token,
                accessToken.expires,
                refreshToken.Expires,
                user.EmailConfirmed
            ));
    }

    private static bool IsAttemptLimitExceeded(User user, int maxAttempts, int lockoutMinutes)
    {
        user.LoginFailedCount++;

        if (user.LoginFailedCount <= maxAttempts)
            return false;

        user.LoginLocked = true;
        user.LoginLockExpires = DateTime.UtcNow.AddMinutes(lockoutMinutes);
        return true;
    }

    private static bool IsAccountLocked(User user)
    {
        switch (user.LoginLocked)
        {
            case true when user.LoginLockExpires >= DateTime.UtcNow:
                return true;

            case true when user.LoginLockExpires < DateTime.UtcNow:
                user.LoginLocked = false;
                user.LoginLockExpires = null;
                user.LoginFailedCount = 0;
                break;
        }

        return false;
    }
}