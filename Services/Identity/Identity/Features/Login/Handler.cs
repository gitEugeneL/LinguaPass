using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using IdentityApi.Tools;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.Login;

public class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    IPasswordService passwordService,
    ITokenService tokenService,
    ILockoutService lockoutService
) : IRequestHandler<Command, Result<Output>>
{
    public const string InvalidLoginData = "login or password is incorrect or account is locked";

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        var user = await dbContext
            .Users
            .Include(u => u.RefreshTokens)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper(), ct);

        if (user is null || lockoutService.IsLoginLocked(user))
            return Result<Output>.Failure(new Error(InvalidLoginData));

        if (lockoutService.IsLoginAttemptLimitExceeded(user))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(new Error(InvalidLoginData));
        }

        if (!passwordService.VerifyPasswordHash(command.Password, user.PwdHash, user.PwdSalt))
        {
            user.LoginFailedCount++;
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(new Error(InvalidLoginData));
        }

        lockoutService.ResetLoginLockout(user);
        tokenService.UpdateRefreshToken(user);

        var accessToken = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken(user);

        await dbContext
            .RefreshTokens
            .AddAsync(
                new RefreshToken
                {
                    Token = refreshToken.token,
                    Expires = refreshToken.expires,
                    User = user
                },
                ct);

        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(
            new Output(
                user.Id,
                accessToken.token,
                refreshToken.token,
                accessToken.expires,
                refreshToken.expires,
                user.EmailConfirmed
            ));
    }
}