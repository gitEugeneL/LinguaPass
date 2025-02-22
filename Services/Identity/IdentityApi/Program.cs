using System.Reflection;
using Carter;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.Services;
using IdentityApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

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

// --------------------------------------------------------------

/*** Authentication policies configure ***/
// builder.Services.Configure();

/*** Authentication configuration ***/
// var authConfiguration = builder.Configuration.GetSection("Authentication");
// builder.Services.AddAuthentication(options =>
// {
// options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
// options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
// options.TokenValidationParameters = new TokenValidationParameters
// {
// ValidateAudience = false, //
// ValidateIssuer = false, //
// ValidateIssuerSigningKey = true,
// ValidateLifetime = true,
// ValidAudience = authConfiguration.GetSection("Audience").Value,
// ValidIssuer = authConfiguration.GetSection("Issuer").Value,
// IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
// .GetBytes(authConfiguration.GetSection("AccessToken.SecurityKey").Value!))
// };
// });


//--------------------------------------------------------------------------------------

var app = builder.Build();

app.MapCarter();

app.UseHttpsRedirection();

app.Run();