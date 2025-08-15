namespace Storage.MessageBroker.Services.Interfaces;

public interface IAccountService
{
    Task UpdateAccountDate(Guid userId);
}