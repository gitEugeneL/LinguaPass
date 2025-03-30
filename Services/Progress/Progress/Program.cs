using Microsoft.EntityFrameworkCore;
using Progress.Data;

var builder = WebApplication.CreateBuilder(args);

/*** Database connection ***/
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PSQL")));

var app = builder.Build();

app.Run();