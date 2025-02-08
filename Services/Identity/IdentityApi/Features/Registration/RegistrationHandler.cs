using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Domain.Entities;
using IdentityApi.Helpers;
using IdentityApi.Utils.CustomResult;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace IdentityApi.Features.Registration;

public class RegistrationHandler(
    IValidator<RegistrationCommand> validator,
    UserManager<User> userManager
) : IRequestHandler<RegistrationCommand, Result<RegistrationResult>>
{
    public async Task<Result<RegistrationResult>> Handle(RegistrationCommand command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<RegistrationResult>.Failure(Error.ValidationError(validationResult.GetValidationProblems()));

        var newUser = new User(command.Email, command.Age);
        var creationResult = await userManager.CreateAsync(newUser, command.Password);

        if (!creationResult.Succeeded)
        {
            var errors = creationResult.Errors.Select(e => e.Description);
            return Result<RegistrationResult>.Failure(Error.AuthenticationError(errors));
        }

        await userManager.AddToRoleAsync(newUser, Roles.Customer);

        // todo add confirmation token
        // todo add email service

        return Result<RegistrationResult>.Success(new RegistrationResult(newUser.Id));
    }
}