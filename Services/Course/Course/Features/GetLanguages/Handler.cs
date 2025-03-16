using Carter.ModelBinding;
using Course.Data;
using Course.Helpers;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetLanguages;

public class Handler(
    AppDbContext dbContext,
    IValidator<Query> validator
) : IRequestHandler<Query, Result<IReadOnlyList<Output>>>
{
    public async Task<Result<IReadOnlyList<Output>>> Handle(Query query, CancellationToken ct)
    {
        var validationResult = await validator.ValidateAsync(query, ct);
        if (!validationResult.IsValid)
            return Result<IReadOnlyList<Output>>.Failure(new Error(validationResult.GetValidationProblems()));

        var result = await dbContext
            .Languages
            .AsNoTracking()
            .Where(l => query.Filter == QueryFilter.All
                        || l.IsActive == (query.Filter == QueryFilter.Active))
            .Select(l => new Output(l.Id, l.Name, l.Description, l.IsActive))
            .ToListAsync(ct);

        return Result<IReadOnlyList<Output>>.Success(result);
    }
}