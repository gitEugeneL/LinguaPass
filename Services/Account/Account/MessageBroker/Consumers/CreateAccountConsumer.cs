using Account.Data.Persistence;
using Account.Domain.Entities;
using MassTransit;
using MessageBroker.Contracts;

namespace Account.MessageBroker.Consumers;

public sealed class CreateAccountConsumer(AppDbContext dbContext) : IConsumer<CreateAccountRequest>
{
    public async Task Consume(ConsumeContext<CreateAccountRequest> context)
    {
        var account = new CustomerAccount
            { UserId = context.Message.UserId, IsActive = true, UpdatedAt = DateTime.UtcNow };
        await dbContext
            .CustomerAccounts
            .AddAsync(account);

        await dbContext.SaveChangesAsync();
    }
}