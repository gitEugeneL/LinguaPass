using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Helpers;
using IdentityApi.Services.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.GenerateCode;

internal class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    ISecurityService securityService,
    IConfirmationService confirmationService
) : IRequestHandler<Command, Result<Output>>
{
    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        var user = await dbContext
            .Users
            .Include(u => u.ConfirmationCode)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper(), ct);

        if (user is null || confirmationService.IsConfirmLocked(user))
            return Result<Output>.Failure(new Error("User is not found or account is locked"));

        user.GenerateCodeCount++;

        if (confirmationService.IsGenerateCodeAttemptLimitExceeded(user))
        {
            await dbContext.SaveChangesAsync(ct);
            return Result<Output>.Failure(new Error("Too many code generation attempts"));
        }

        var confirmationCode = user.ConfirmationCode;
        var (code, expires) = securityService.GenerateCode(user);

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