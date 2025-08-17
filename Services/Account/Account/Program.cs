using Account.Data.Persistence;
using Account.Grpc;
using Account.Grpc.Servers;
using Account.MessageBroker.Consumers;
using Account.MessageBroker.Services;
using Account.MessageBroker.Services.Interfaces;
using AuthConfig.Configs;
using FastEndpoints;
using MessageBroker.Configs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/*** Add common auth settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), true, true);

/*** Add common rabbitMQ settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "brokersettings.json"), true, true);

/*** Database connection ***/
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PSQL")));

/*** JWT auth configuration (Common config) ***/
builder.Services.ConfigureAuthentication(builder.Configuration);

/*** Auth Policy (Common config) ***/
builder.Services.ConfigureAuthPolicy();

/*** Fast Endpoints ***/
builder.Services.AddFastEndpoints();

/*** Add gRPC functionality (server) ***/
builder.Services.AddGrpc();

/*** gRPC Clients ***/
builder.Services.AddGrpcClients(builder.Configuration);

/*** RabbitMQ configuration (Common config) ***/
builder.Services.ConfigureMassTransit(builder.Configuration,
    busConfigurator =>
    {
        busConfigurator.AddConsumer<CreateAccountConsumer>();
        busConfigurator.AddConsumer<UpdateDateAccountConsumer>();
        // another consumers
    });

/*** Message broker services ***/
builder.Services.AddScoped<IProgressService, ProgressService>();

var app = builder.Build();

/*** Add gRPC servers ***/
app.MapGrpcService<AccountServer>();

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.UseFastEndpoints();

app.Run();

public abstract partial class Program;