using Course.Helpers;
using MediatR;

namespace Course.Features.GetLanguages;

public enum QueryFilter
{
    All,
    Active,
    Disabled
}

public sealed record Query(
    QueryFilter Filter
) : IRequest<Result<IReadOnlyList<Output>>>;