using System.Reflection;
using System.Security.Claims;
using System.Text;
using Carter;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Helpers;
using IdentityApi.Services;
using IdentityApi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddScoped<IPasswordService, PasswordService>()
    .AddScoped<ISecurityService, SecurityService>();

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

/*** Authentication configuration ***/
var authConfiguration = builder.Configuration.GetSection("Authentication");
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidAudience = authConfiguration.GetSection("Audience").Value,
            ValidIssuer = authConfiguration.GetSection("Issuer").Value,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(authConfiguration.GetSection("AccessToken.SecurityKey").Value!))
        };
    });

/*** Authentication roles policies ***/
builder.Services.AddAuthorizationBuilder()
    .AddPolicy(Roles.Customer.Name, policy =>
        policy
            .RequireClaim(ClaimTypes.Email)
            .RequireClaim(ClaimTypes.NameIdentifier)
            .RequireClaim(ClaimTypes.Role)
            .RequireRole(Roles.Customer.Name)
            .RequireClaim("isEmailConfirmed")
    )
    .AddPolicy(Roles.Admin.Name, policy =>
        policy
            .RequireClaim(ClaimTypes.Email)
            .RequireClaim(ClaimTypes.NameIdentifier)
            .RequireClaim(ClaimTypes.Role)
            .RequireRole(Roles.Admin.Name)
            .RequireClaim("isEmailConfirmed"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    /*** Seed develop data ***/
    // using var scope = app.Services.CreateScope();
    // var context = scope.ServiceProvider.GetService<AppDbContext>()!;
    // DataInitializer.SeedData(context);
}

app.MapCarter();

app.UseHttpsRedirection();

app.Run();