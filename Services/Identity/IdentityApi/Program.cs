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
    .AddScoped<ISecurityService, SecurityService>()
    .AddScoped<IConfirmationService, ConfirmationService>();

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

app.UseHttpsRedirection();

app.Run();

public abstract partial class Program;