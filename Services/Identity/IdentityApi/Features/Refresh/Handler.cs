using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Services.Interfaces;
using IdentityApi.Utils.CustomResult;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.Refresh;

internal class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    ITokenService tokenService
) : IRequestHandler<Command, Result<Output>>
{
    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(Error.ValidationError(validationResult.GetValidationProblems()));

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
            return Result<Output>.Failure(Error.AuthenticationError("User not found or token invalid"));

        if (dbResult.RefreshToken is null || dbResult.RefreshToken.Expires < DateTime.UtcNow)
            return Result<Output>.Failure(Error.AuthenticationError("Token expired or invalid"));

        var accessToken = tokenService.GenerateAccessToken(dbResult.User);
        var refreshToken = tokenService.GenerateRefreshToken(dbResult.User);

        dbResult.User.RefreshTokens.Remove(dbResult.RefreshToken);
        dbResult.User.RefreshTokens.Add(refreshToken);

        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(accessToken, refreshToken, dbResult.User.EmailConfirmed));
    }
}