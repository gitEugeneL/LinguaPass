using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using IdentityApi.Utils;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.GenerateCode;

public class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    IConfirmationService confirmationService,
    ILockoutService lockoutService
) : IRequestHandler<Command, Result<Output>>
{
    public const string InvalidData = "User is not found or account is locked";

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        var user = await dbContext
            .Users
            .Include(u => u.ConfirmationCode)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper(), ct);

        if (user is null || lockoutService.IsConfirmLocked(user))
            return Result<Output>.Failure(new Error(InvalidData));

        user.GenerateCodeCount++;

        if (lockoutService.IsGenerateCodeAttemptLimitExceeded(user))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(new Error(InvalidData));
        }

        var confirmationCode = user.ConfirmationCode;
        var (code, expires) = confirmationService.GenerateCode();

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

        return Result<Output>.Success(new Output(user.Email.ToLower(), expires));
    }
}