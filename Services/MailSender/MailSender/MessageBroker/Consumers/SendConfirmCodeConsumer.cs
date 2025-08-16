using MailSender.Services.Interfaces;
using MassTransit;
using MessageBroker.Contracts;

namespace MailSender.MessageBroker.Consumers;

public class SendConfirmCodeConsumer(IMailService mailService) : IConsumer<SendConfirmationCodeRequest>
{
    public async Task Consume(ConsumeContext<SendConfirmationCodeRequest> context)
    {
        await mailService.SendMailAsync(
            context.Message.Email,
            context.Message.Title,
            context.Message.Code
        );
    }
}