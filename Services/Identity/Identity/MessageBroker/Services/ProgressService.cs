using IdentityApi.MessageBroker.Services.Interfaces;
using MassTransit;
using MessageBroker.Contracts;

namespace IdentityApi.MessageBroker.Services;

public sealed class ProgressService(IPublishEndpoint publishEndpoint) : IProgressService
{
    public async Task CreateUserProgress(Guid userId)
    {
        var request = new CreateProgressRequest(userId);
        await publishEndpoint.Publish(request);
    }
}