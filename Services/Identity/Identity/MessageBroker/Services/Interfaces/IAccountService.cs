namespace IdentityApi.MessageBroker.Services.Interfaces;

public interface IAccountService
{
    Task CreateAccount(Guid userId);
}