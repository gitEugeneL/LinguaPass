namespace Account.Features.ApplicationComplete;

public sealed record Request(string UserId, bool IsApplicationValid, string? Message);

public sealed record Response(Guid UserId);