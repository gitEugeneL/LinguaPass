using MailSender.MessageBroker.Consumers;
using MailSender.Services;
using MailSender.Services.Interfaces;
using MessageBroker.Configs;

var builder = WebApplication.CreateBuilder(args);

/*** Add common rabbitMQ settings ***/
builder.Configuration.AddJsonFile(Path.Combine(AppContext.BaseDirectory, "brokersettings.json"), true, true);

builder.Services.AddTransient<IMailService, MailService>();

/*** RabbitMQ configuration (Common config) ***/
builder.Services.ConfigureMassTransit(builder.Configuration,
    busConfigurator => { busConfigurator.AddConsumer<SendConfirmCodeConsumer>(); });


var app = builder.Build();

app.Run();

public abstract partial class Program;