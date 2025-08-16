namespace Account.Features.GetDashboardInfo;

public sealed record Response(
    int CurrentApplicationCount,
    int ArchivedApplicationCount,
    DateTime? LastUpdated
);