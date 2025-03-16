using System.Reflection;
using System.Text;
using Carter;
using Course.Data;
using Course.Utils;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

/*** Database connection ***/
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PSQL")));

/*** FluentValidation configuration**/
builder.Services
    .AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

/*** MediatR configuration ***/
builder.Services.AddMediatR(config =>
    config.RegisterServicesFromAssembly(typeof(Program).Assembly));

/*** Carter configuration ***/
builder.Services.AddCarter();

/*** JWT auth configuration ***/
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(3),

            ValidIssuer = builder.Configuration.GetSection("Authentication:Issuer").Value,
            ValidAudience = builder.Configuration.GetSection("Authentication:Audience").Value,

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("Authentication:AccessToken.SecurityKey").Value!))
        };
    });

/*** Auth Policy ***/
builder.Services.ConfigureAuthPolicy();

var app = builder.Build();

app.MapCarter();

app.UseHttpsRedirection();

app.Run();

public abstract partial class Program;