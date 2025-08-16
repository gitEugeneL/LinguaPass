using Common.GrpcProtos;
using Course.Grpc.Clients;
using Grpc.Net.Client;

namespace Course.Grpc;

public class AccountGrpcChannel(string address)
{
    public GrpcChannel Channel { get; } = GrpcChannel.ForAddress(address);
}

public static class GrpcClientsConfig
{
    public static IServiceCollection AddGrpcClients(this IServiceCollection services, IConfiguration configuration)
    {
        var accountServer = configuration["GrpcServers:Account"]!;

        services.AddSingleton<AccountGrpcChannel>(provider =>
            new AccountGrpcChannel(accountServer));

        services.AddSingleton<Accounts.AccountsClient>(provider =>
        {
            var channelWrapper = provider.GetRequiredService<AccountGrpcChannel>();
            return new Accounts.AccountsClient(channelWrapper.Channel);
        });
        services.AddSingleton<AccountClient>();

        return services;
    }
}