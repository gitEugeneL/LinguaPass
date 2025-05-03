using AuthConfig.Configs;
using FastEndpoints;
using Minio;
using Storage.Services;
using Storage.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddScoped<ISecurityService, SecurityService>()
    .AddScoped<IStorageService, StorageService>();

/*** Add common auth settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), false, true);

/*** JWT auth configuration (Common config) ***/
builder.Services.ConfigureAuthentication(builder.Configuration);

/*** Auth Policy (Common config) ***/
builder.Services.ConfigureAuthPolicy();

/*** Fast Endpoints ***/
builder.Services.AddFastEndpoints();

/*** RabbitMQ configuration (Common config) ***/
//todo
//todo
//todo
//todo
//todo
//todo
//todo
//todo

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

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.UseFastEndpoints();

app.Run();