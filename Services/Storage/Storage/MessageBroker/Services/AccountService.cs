using MassTransit;
using MessageBroker.Contracts;
using Storage.MessageBroker.Services.Interfaces;

namespace Storage.MessageBroker.Services;

public class AccountService(IPublishEndpoint publishEndpoint) : IAccountService
{
    public async Task UpdateAccountDate(Guid userId)
    {
        var request = new UpdateDateAccountRequest(userId);
        await publishEndpoint.Publish(request);
    }
}