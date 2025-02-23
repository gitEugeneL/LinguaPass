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
            .Include(u => u.RefreshTokens)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper(), ct);


        if (user is null || confirmationService.IsLoginLocked(user))
            return Result<Output>.Failure(
                Error.AuthenticationError("login or password is incorrect or account is locked"));


        if (confirmationService.IsLoginAttemptLimitExceeded(user))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(Error.AuthenticationError("Too many login attempts"));
        }

        if (!passwordService.VerifyPasswordHash(command.Password, user.PwdHash, user.PwdSalt))
        {
            user.LoginFailedCount++;
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(
                Error.AuthenticationError("login or password is incorrect or account is locked"));
        }

        confirmationService.ResetLoginLockout(user);
        securityService.UpdateRefreshToken(user);

        var accessToken = securityService.GenerateAccessToken(user);
        var refreshToken = securityService.GenerateRefreshToken(user);

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
                accessToken.token,
                refreshToken.token,
                accessToken.expires,
                refreshToken.expires,
                user.EmailConfirmed
            ));
    }
}