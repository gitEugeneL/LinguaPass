using Account.Grpc.Clients;
using Common.GrpcProtos;
using Grpc.Net.Client;

namespace Account.Configs;

public static class GrpcClientsConfig
{
    public static IServiceCollection AddGrpcClients(this IServiceCollection services, IConfiguration configuration)
    {
        var courseServer = configuration["GrpcServers:Course"]!;

        services.AddSingleton(provider =>
            GrpcChannel.ForAddress(courseServer));

        services.AddSingleton<Languages.LanguagesClient>(provider =>
        {
            var channel = provider.GetRequiredService<GrpcChannel>();
            return new Languages.LanguagesClient(channel);
        });

        /*** Example **/
        // services.AddSingleton<OtherService.OtherServiceClient>(provider =>
        // {
        //     var channel = provider.GetRequiredService<GrpcChannel>();
        //     return new OtherService.OtherServiceClient(channel);
        // });
        // services.AddSingleton<OtherClient>();

        services.AddSingleton<LanguageClient>();

        return services;
    }
}