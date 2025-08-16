namespace Account.Features.ChangeActiveAccount;

public sealed record Request(bool IsActive);

public sealed record Response(bool IsSuccess);