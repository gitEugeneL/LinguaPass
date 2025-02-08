using IdentityApi.Domain.Entities;
using IdentityApi.Helpers;

namespace IdentityApi.Data;

public static class DataInitializer
{
    public static void SeedData(AppDbContext context)
    {
        context.Database.EnsureCreated();
        SeedRoles(context);
    }

    private static void SeedRoles(AppDbContext context)
    {
        if (context.Roles.Any()) return;

        var roles = new[]
        {
            new Role
            {
                Id = Guid.NewGuid().ToString(),
                Name = Roles.Admin,
                NormalizedName = Roles.Admin.ToUpper(),
                Description = "Administrator role with full access to manage system settings, users, and resources."
            },
            new Role
            {
                Id = Guid.NewGuid().ToString(),
                Name = Roles.Customer,
                NormalizedName = Roles.Customer.ToUpper(),
                Description = "User role with access to interact with the system's core features and services."
            }
        };
        context.Roles.AddRange(roles);
        context.SaveChanges();
    }
}