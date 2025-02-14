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

        switch (user.LoginLocked)
        {
            case true when user.LoginLockExpires >= DateTime.UtcNow:
                return Result<Output>.Failure(Error.AuthenticationError("account is locked"));

            case true when user.LoginLockExpires < DateTime.UtcNow:
                ResetLoginLock(user);
                break;
        }

        if (!passwordService.VerifyPasswordHash(command.Password, user.PwdHash, user.PwdSalt))
        {
            ProcessFailedLogin(user);
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("login or password is incorrect"));
        }

        ResetLoginLock(user);

        var refreshTokenMaxCount = int.Parse(configuration.GetSection("Authentication:RefreshToken.MaxCount").Value!);
        if (user.RefreshTokens.Count >= refreshTokenMaxCount)
            user.RefreshTokens.Remove(user.RefreshTokens.OrderBy(rt => rt.Expires).First());

        var accessToken = securityService.GenerateAccessToken(user);
        var refreshToken = securityService.GenerateRefreshToken(user);

        user.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(accessToken, refreshToken, user.EmailConfirmed));
    }

    private void ProcessFailedLogin(User user)
    {
        var tries = int.Parse(configuration.GetSection("Authentication:LoginLockout.MaxLoginCount").Value!);
        var minutes = int.Parse(configuration.GetSection("Authentication:LoginLockout.AddMin").Value!);

        user.LoginFailedCount++;
        if (user.LoginFailedCount < tries) return;
        user.LoginLocked = true;
        user.LoginLockExpires = DateTime.UtcNow.AddMinutes(minutes);
    }

    private static void ResetLoginLock(User user)
    {
        user.LoginLocked = false;
        user.LoginLockExpires = null;
        user.LoginFailedCount = 0;
    }
}