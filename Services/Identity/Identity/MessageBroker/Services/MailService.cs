using IdentityApi.MessageBroker.Services.Interfaces;
using MassTransit;
using MessageBroker.Contracts;

namespace IdentityApi.MessageBroker.Services;

public class MailService(IPublishEndpoint publishEndpoint) : IMailService
{
    public async Task SendConfirmationCode(string email, string title, string code)
    {
        var request = new SendConfirmationCodeRequest(email, title, code);
        await publishEndpoint.Publish(request);
    }
}