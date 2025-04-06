using Shared.Domain.Enums;

namespace Account.MessageBroker.Services.Interfaces;

public interface IProgressService
{
    Task ChangeUserSteep(Guid userId, Steps step);
}