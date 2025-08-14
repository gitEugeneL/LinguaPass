namespace MessageBroker.Contracts;

public sealed record CreateAccountRequest(Guid UserId);

public sealed record UpdateDateAccountRequest(Guid UserId);