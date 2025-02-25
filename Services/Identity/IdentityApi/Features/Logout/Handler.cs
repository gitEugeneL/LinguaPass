using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Helpers;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.Logout;

internal class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator) : IRequestHandler<Command, Result<Output>>
{
    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        var dbResult = await dbContext
            .RefreshTokens
            .Where(rt => rt.Token == command.RefreshToken && rt.UserId == command.UserId)
            .ExecuteDeleteAsync(ct) > 0;

        return dbResult
            ? Result<Output>.Success(new Output(dbResult))
            : Result<Output>.Failure(new Error("Invalid token or user"));
    }
}