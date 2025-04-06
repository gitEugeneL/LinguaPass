using Shared.Domain.Enums;

namespace MessageBroker.Contracts;

public sealed record CreateProgressRequest(Guid UserId);

public sealed record ChangeSteepRequest(Guid UserId, Steps Step);