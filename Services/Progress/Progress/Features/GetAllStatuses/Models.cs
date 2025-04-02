namespace Progress.Features.GetAllStatuses;

public sealed record Response(List<Item> Submission, List<Item> Review);

public sealed record Item(int Order, string Name);