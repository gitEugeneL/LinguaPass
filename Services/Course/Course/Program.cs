using AuthConfig.Configs;
using Course.Data.Persistence;
using Course.Grpc;
using Course.Grpc.Servers;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/*** Add common auth settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), true, true);

/*** Database connection ***/
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PSQL")));

/*** JWT auth configuration ***/
builder.Services.ConfigureAuthentication(builder.Configuration);

/*** Auth Policy ***/
builder.Services.ConfigureAuthPolicy();

/*** Add gRPC functionality (server) ***/
builder.Services.AddGrpc();

/*** gRPC Clients ***/
builder.Services.AddGrpcClients(builder.Configuration);

/*** Add FastEndpoints functionality ***/
builder.Services.AddFastEndpoints();

var app = builder.Build();

/*** Add gRPC servers ***/
app.MapGrpcService<CourseServer>();

app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.UseFastEndpoints();

app.Run();

public abstract partial class Program;