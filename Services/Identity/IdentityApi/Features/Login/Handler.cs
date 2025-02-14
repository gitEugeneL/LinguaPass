using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using IdentityApi.Utils.CustomResult;
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
    private readonly int _loginLockoutMinutes = int.Parse(configuration["Authentication:LoginLockout.AddMin"]!);
    private readonly int _maxLoginAttempts = int.Parse(configuration["Authentication:LoginLockout.MaxLoginCount"]!);
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

        if (user is null)
            return Result<Output>.Failure(Error.AuthenticationError("login or password is incorrect"));

        if (IsAccountLocked(user))
            return Result<Output>.Failure(Error.AuthenticationError("account is locked"));

        if (!passwordService.VerifyPasswordHash(command.Password, user.PwdHash, user.PwdSalt))
        {
            ProcessFailedLogin(user, _maxLoginAttempts, _loginLockoutMinutes);
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("login or password is incorrect"));
        }

        if (!passwordService.VerifyPasswordHash(command.Password, user.PwdHash, user.PwdSalt))
        {
            ProcessFailedLogin(user, _maxLoginAttempts, _loginLockoutMinutes);
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("login or password is incorrect"));
        }

        ResetLoginLock(user);

        if (user.RefreshTokens.Count >= _refreshTokenMaxCount)
            user.RefreshTokens.Remove(user.RefreshTokens.OrderBy(rt => rt.Expires).First());

        var accessToken = securityService.GenerateAccessToken(user);
        var refreshToken = securityService.GenerateRefreshToken(user);

        user.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(accessToken, refreshToken, user.EmailConfirmed));
    }

    private static void ProcessFailedLogin(User user, int maxLoginAttempts, int loginLockoutMinutes)
    {
        user.LoginFailedCount++;
        if (user.LoginFailedCount < maxLoginAttempts) return;

        user.LoginLocked = true;
        user.LoginLockExpires = DateTime.UtcNow.AddMinutes(loginLockoutMinutes);
    }

    private static void ResetLoginLock(User user)
    {
        user.LoginLocked = false;
        user.LoginLockExpires = null;
        user.LoginFailedCount = 0;
    }

    private static bool IsAccountLocked(User user)
    {
        switch (user.LoginLocked)
        {
            case true when user.LoginLockExpires >= DateTime.UtcNow:
                return true;

            case true when user.LoginLockExpires < DateTime.UtcNow:
                ResetLoginLock(user);
                break;
        }

        return false;
    }
}