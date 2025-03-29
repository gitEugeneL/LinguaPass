using Account.Data;
using Account.Grpc;
using AuthConfig.Configs;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/*** Add common auth settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), false, true);

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

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.UseFastEndpoints();

app.Run();

public abstract partial class Program;