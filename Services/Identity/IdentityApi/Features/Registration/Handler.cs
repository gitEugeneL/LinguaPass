using Carter.ModelBinding;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Domain.Entities;
using IdentityApi.Helpers;
using IdentityApi.Services.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdentityApi.Features.Registration;

public class Handler(
    IValidator<Command> validator,
    AppDbContext dbContext,
    IPasswordService passwordService
) : IRequestHandler<Command, Result<Output>>
{
    public const string AlreadyRegistered = "User already exists";

    public async Task<Result<Output>> Handle(Command command, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result<Output>.Failure(new Error(validationResult.GetValidationProblems()));

        if (await dbContext.Users.AnyAsync(u => u.Email == command.Email.ToUpper(), ct))
            return Result<Output>.Failure(new Error(AlreadyRegistered));

        passwordService.CreatePasswordHash(command.Password, out var passwordHash, out var passwordSalt);

        var customerRole = await dbContext.Roles.FirstAsync(r => r.Id == AppConstants.Customer.Id, ct);
        var user = new User
        {
            Email = command.Email.ToUpper(),
            Age = command.Age,
            Role = customerRole,
            PwdHash = passwordHash,
            PwdSalt = passwordSalt
        };

        await dbContext.Users.AddAsync(user, ct);
        await dbContext.SaveChangesAsync(ct);

        return Result<Output>.Success(new Output(user.Id));
    }
}