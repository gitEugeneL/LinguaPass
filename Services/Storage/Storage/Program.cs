using AuthConfig.Configs;
using FastEndpoints;
using MessageBroker.Configs;
using Minio;
using Storage.Grps.Servers;
using Storage.MessageBroker.Services;
using Storage.MessageBroker.Services.Interfaces;
using Storage.Services;
using Storage.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddScoped<ISecurityService, SecurityService>()
    .AddScoped<IStorageService, StorageService>();

/*** Add common auth settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), true, true);

/*** Add common rabbitMQ settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "brokersettings.json"), true, true);

/*** JWT auth configuration (Common config) ***/
builder.Services.ConfigureAuthentication(builder.Configuration);

/*** Auth Policy (Common config) ***/
builder.Services.ConfigureAuthPolicy();

/*** Add gRPC functionality (server) ***/
builder.Services.AddGrpc();

/*** Fast Endpoints ***/
builder.Services.AddFastEndpoints();

/*** RabbitMQ configuration (Common config) ***/
builder.Services.ConfigureMassTransit(builder.Configuration);

/*** Message broker services ***/
builder.Services.AddScoped<IAccountService, AccountService>();

/*** MinIO fileStorage configuration ***/
builder.Services.AddMinio(options =>
{
    options.WithEndpoint(builder.Configuration["MinIOStorage:Endpoint"]);
    options.WithCredentials(
        builder.Configuration["MinIOStorage:AccessKey"],
        builder.Configuration["MinIOStorage:SecretKey"]
    );
    options.WithSSL(false); // [!!!] ony for dev environment [!!!]
    options.Build();
});

var app = builder.Build();

/*** Add gRPC servers ***/
app.MapGrpcService<StorageServer>();

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.UseFastEndpoints();

app.Run();