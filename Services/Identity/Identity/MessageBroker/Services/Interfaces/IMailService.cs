namespace IdentityApi.MessageBroker.Services.Interfaces;

public interface IMailService
{
    Task SendConfirmationCode(string email, string title, string code);
}