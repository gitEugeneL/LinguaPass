using IdentityApi.MessageBroker.Services.Interfaces;
using MassTransit;
using MessageBroker.Contracts;

namespace IdentityApi.MessageBroker.Services;

public sealed class AccountService(IPublishEndpoint publishEndpoint) : IAccountService
{
    public async Task CreateAccount(Guid userId)
    {
        var request = new CreateAccountRequest(userId);
        await publishEndpoint.Publish(request);
    }
}