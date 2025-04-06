using Account.MessageBroker.Services.Interfaces;
using MassTransit;
using MessageBroker.Contracts;
using Shared.Domain.Enums;

namespace Account.MessageBroker.Services;

public class ProgressService(IPublishEndpoint publishEndpoint) : IProgressService
{
    public async Task ChangeUserSteep(Guid userId, Steps step)
    {
        var request = new ChangeSteepRequest(userId, step);
        await publishEndpoint.Publish(request);
    }
}