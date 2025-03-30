namespace IdentityApi.MessageBroker.Services.Interfaces;

public interface IProgressService
{
    Task CreateUserProgress(Guid userId);
}