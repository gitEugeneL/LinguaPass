using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Tools;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.Logout;

public class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator) : IRequestHandler<Command, Result<Output>>
{
    public const string InvalidData = "Invalid token or user";

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        var refreshToken = await dbContext
            .RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == command.RefreshToken
                                       && rt.UserId == command.UserId, ct);

        if (refreshToken is null)
            return Result<Output>.Failure(new Error(InvalidData));

        dbContext.Remove(refreshToken);
        return Result<Output>.Success(new Output(true));
    }
}