using AuthConfig.Tools;
using FastEndpoints;
using Progress.Domain.Entities.Enums;

namespace Progress.Features.GetAllStatuses;

public class Endpoint : EndpointWithoutRequest<Response>
{
    public override void Configure()
    {
        Get("/api/statuses");
        Policies(Constants.BasePolicy);
        ResponseCache(120);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var statuses = Enum.GetValues<Steps>()
            .Select(step => new Item(
                (int)step,
                step.ToString()))
            .ToList();

        var response = new Response(
            statuses
                .Where(s => s.Name.StartsWith("Submission"))
                .Select(s => s with { Name = s.Name.Replace("Submission", "") })
                .ToList(),
            statuses
                .Where(s => s.Name.StartsWith("Review"))
                .Select(s => s with { Name = s.Name.Replace("Review", "") })
                .ToList()
        );

        await SendResultAsync(TypedResults.Ok(response));
    }
}