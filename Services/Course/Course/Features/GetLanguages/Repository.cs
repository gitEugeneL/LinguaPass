using Course.Data;
using Course.Features.Shared;
using Microsoft.EntityFrameworkCore;

namespace Course.Features.GetLanguages;

public static class Repository
{
    public static async Task<CollectionResponse<Response>> GetLanguages(QueryFilter filter, AppDbContext dbContext,
        CancellationToken ct)
    {
        return new CollectionResponse<Response>(
            await dbContext
                .Languages
                .AsNoTracking()
                .Where(l => filter == QueryFilter.All || l.IsActive == (filter == QueryFilter.Active))
                .Select(l => new Response(l.Id, l.Name, l.Description, l.IsActive))
                .ToListAsync(ct));
    }
}