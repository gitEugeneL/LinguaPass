using AuthConfig.Configs;
using FastEndpoints;
using MessageBroker.Configs;
using Microsoft.EntityFrameworkCore;
using Progress.Data;
using Progress.MessageBroker.Consumers;

var builder = WebApplication.CreateBuilder(args);

/*** Add common auth settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), false, true);
/*** Add common rabbitMQ settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "brokersettings.json"), false, true);

/*** Database connection ***/
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PSQL")));

/*** JWT auth configuration (Common config) ***/
builder.Services.ConfigureAuthentication(builder.Configuration);

/*** Auth Policy (Common config) ***/
builder.Services.ConfigureAuthPolicy();

/*** Fast Endpoints ***/
builder.Services.AddFastEndpoints();

/*** RabbitMQ configuration (Common config) ***/
builder.Services.ConfigureMassTransit(builder.Configuration,
    busConfigurator =>
    {
        busConfigurator.AddConsumer<CreateProgressConsumer>();
        busConfigurator.AddConsumer<ChangeSteepConsumer>();
        // add another consumers
    });

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.UseFastEndpoints();

app.Run();