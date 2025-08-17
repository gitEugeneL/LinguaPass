var builder = WebApplication.CreateBuilder(args);

/*** CORS dev config ***/
builder.Services.AddCors(options =>
{
    options.AddPolicy("devWebClients", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

/*** Add gateway configuration ***/
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .ConfigureHttpClient((context, handler) =>
    {
        handler.SslOptions.RemoteCertificateValidationCallback =
            (sender, certificate, chain, sslPolicyErrors) => true;
    });


var app = builder.Build();

app.UseCors("devWebClients");
app.MapReverseProxy();

app.Run();