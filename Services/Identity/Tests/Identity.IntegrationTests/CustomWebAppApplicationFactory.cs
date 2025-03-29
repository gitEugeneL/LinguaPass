using IdentityApi.Data;
using IdentityApi.IntegrationTests.FakeServices;
using IdentityApi.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityApi.IntegrationTests;

public class CustomWebAppApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            // Add configuration files (main and shared)
            config
                .AddJsonFile("appsettings.json", true, true)
                .AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), false, true);
        });

        builder.ConfigureTestServices(services =>
        {
            // Remove dbContext (.net9 solution)
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(IDbContextOptionsConfiguration<AppDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            // Add InMemoryDatabase
            var dbName = Guid.NewGuid().ToString();
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase(dbName));

            // Init migrations and seed data
            using var scope = services.BuildServiceProvider().CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
            SeedTestData(db);

            // Add fake confirmation service (generate confirm code)
            services.AddScoped<IConfirmationService, FakeConfirmationService>();
        });
    }

    private static void SeedTestData(AppDbContext db)
    {
        // Seed base data for tests here
        // db.SaveChanges();
    }
}