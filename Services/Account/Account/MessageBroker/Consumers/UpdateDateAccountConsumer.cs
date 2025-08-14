using Account.Data.Persistence;
using MassTransit;
using MessageBroker.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Account.MessageBroker.Consumers;

public class UpdateDateAccountConsumer(AppDbContext dbContext) : IConsumer<UpdateDateAccountRequest>
{
    public async Task Consume(ConsumeContext<UpdateDateAccountRequest> context)
    {
        var account = await dbContext
            .CustomerAccounts
            .FirstAsync(c => c.UserId == context.Message.UserId);

        account.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
    }
}