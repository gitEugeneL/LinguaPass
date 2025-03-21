using Course.Data;
using Course.Tools;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/*** Database connection ***/
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PSQL")));

/*** JWT auth configuration ***/
builder.Services.ConfigureAuthentication(builder.Configuration);

/*** Auth Policy ***/
builder.Services.ConfigureAuthPolicy();

builder.Services.AddFastEndpoints();

var app = builder.Build();

app.UseAuthentication();

app.UseAuthorization();

app.UseResponseCaching();

app.UseFastEndpoints();

app.Run();

public abstract partial class Program;