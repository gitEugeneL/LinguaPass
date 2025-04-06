using MassTransit;
using MessageBroker.Contracts;
using Progress.Data;
using Progress.Domain.Entities;
using Shared.Domain.Enums;

namespace Progress.MessageBroker.Consumers;

public class CreateProgressConsumer(AppDbContext dbContext) : IConsumer<CreateProgressRequest>
{
    public async Task Consume(ConsumeContext<CreateProgressRequest> context)
    {
        var userProgress = new CustomerProgress
        {
            UserId = context.Message.UserId,
            Step = Steps.SubmissionLanguage
        };

        await dbContext
            .CustomerProgress
            .AddAsync(userProgress);

        await dbContext.SaveChangesAsync();
    }
}