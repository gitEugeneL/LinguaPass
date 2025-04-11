using MassTransit;
using MessageBroker.Contracts;
using Microsoft.EntityFrameworkCore;
using Progress.Data;

namespace Progress.MessageBroker.Consumers;

public class ChangeSteepConsumer(AppDbContext dbContext) : IConsumer<ChangeSteepRequest>
{
    public async Task Consume(ConsumeContext<ChangeSteepRequest> context)
    {
        await dbContext
            .CustomerProgress
            .Where(u => u.UserId == context.Message.UserId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(u => u.Step, context.Message.Step));
        await dbContext.SaveChangesAsync();
    }
}