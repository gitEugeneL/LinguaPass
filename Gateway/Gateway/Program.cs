var builder = WebApplication.CreateBuilder(args);

/*** Https dev certs config ***/
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(7161, listenOptions => { listenOptions.UseHttps("devCerts/localhost.pfx"); });
    options.ListenLocalhost(5224);
});

/*** CORS dev config ***/
builder.Services.AddCors(options =>
{
    options.AddPolicy("devWebClient", policy =>
    {
        policy.WithOrigins("https://localhost:5173")
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

/*** Add gateway configuration ***/
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseCors("devWebClient");

app.MapReverseProxy();

app.Run();