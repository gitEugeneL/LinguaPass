using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.MessageBroker.Services.Interfaces;
using IdentityApi.Services.Interfaces;
using IdentityApi.Tools;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Constants = AuthConfig.Tools.Constants;

namespace IdentityApi.Features.GenerateCode;

public class Handler(
    AppDbContext dbContext,
    IValidator<Command> validator,
    IConfirmationService confirmationService,
    ILockoutService lockoutService,
    IMailService mailService
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
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == command.Email.ToUpper() && u.Role.Name == Constants.CustomerRole, ct);

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

        // RabbitMQ request (consumer: mailSender microservice)
        await mailService.SendConfirmationCode(user.Email, "confirmation code", code);

        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(user.Email.ToLower(), expires));
    }
}