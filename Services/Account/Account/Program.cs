using Account.Data.Persistence;
using Account.Grpc;
using Account.MessageBroker.Consumers;
using Account.MessageBroker.Services;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Configs;
using FastEndpoints;
using MessageBroker.Configs;
using Microsoft.EntityFrameworkCore;

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

/*** gRPC Clients ***/
builder.Services.AddGrpcClients(builder.Configuration);

/*** RabbitMQ configuration (Common config) ***/
builder.Services.ConfigureMassTransit(builder.Configuration,
    busConfigurator =>
    {
        busConfigurator.AddConsumer<CreateAccountConsumer>();
        // add another consumers
    });

/*** Message broker services ***/
builder.Services.AddScoped<IProgressService, ProgressService>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.UseFastEndpoints();

app.Run();

public abstract partial class Program;