using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Helpers;
using IdentityApi.Services.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.Refresh;

public class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    ITokenService tokenService
) : IRequestHandler<Command, Result<Output>>
{
    public const string InvalidUser = "User not found or token invalid";
    public const string InvalidToken = "Token expired or invalid";

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        var dbResult = await dbContext
            .Users
            .Include(u => u.Role)
            .Where(u => u.Id == command.UserId)
            .Select(u => new
            {
                User = u,
                RefreshToken = u.RefreshTokens.FirstOrDefault(rt => rt.Token == command.RefreshToken)
            })
            .FirstOrDefaultAsync(ct);

        if (dbResult?.User is null)
            return Result<Output>.Failure(new Error(InvalidUser));

        if (dbResult.RefreshToken is null || !tokenService.IsRefreshTokenActive(dbResult.RefreshToken))
            return Result<Output>.Failure(new Error(InvalidToken));

        var accessToken = tokenService.GenerateAccessToken(dbResult.User);
        var refreshToken = tokenService.GenerateRefreshToken(dbResult.User);

        dbResult.User.RefreshTokens.Remove(dbResult.RefreshToken);
        dbResult.User.RefreshTokens.Add(
            new RefreshToken
            {
                Token = refreshToken.token,
                Expires = refreshToken.expires,
                User = dbResult.User
            });

        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(
            new Output(
                dbResult.User.Id,
                accessToken.token,
                refreshToken.token,
                accessToken.expires,
                refreshToken.expires,
                dbResult.User.EmailConfirmed
            ));
    }
}