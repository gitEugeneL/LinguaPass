using System.Reflection;
using Carter;
using FluentValidation;
using IdentityApi.Data;
using IdentityApi.MessageBroker.Services;
using IdentityApi.MessageBroker.Services.Interfaces;
using IdentityApi.Services;
using IdentityApi.Services.Interfaces;
using MessageBroker.Configs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddScoped<IPasswordService, PasswordService>()
    .AddScoped<ITokenService, TokenService>()
    .AddScoped<IConfirmationService, ConfirmationService>()
    .AddScoped<ILockoutService, LockoutService>();

/*** Add common rabbitMQ settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "brokersettings.json"), false, true);

/*** RabbitMQ configuration (Common config) ***/
builder.Services.ConfigureMassTransit(builder.Configuration);

/*** Message broker services ***/
builder.Services
    .AddScoped<IAccountService, AccountService>()
    .AddScoped<IProgressService, ProgressService>()
    .AddScoped<IMailService, MailService>();

/*** Add common auth settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "authsettings.json"), false, true);

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

var app = builder.Build();

app.MapCarter();
app.Run();

public abstract partial class Program;