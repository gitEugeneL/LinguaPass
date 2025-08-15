using Account.Grpc.Clients;
using Common.GrpcProtos;
using Grpc.Net.Client;

namespace Account.Grpc;

public class CourseGrpcChannel(string address)
{
    public GrpcChannel Channel { get; } = GrpcChannel.ForAddress(address);
}

public class ProgressGrpcChannel(string address)
{
    public GrpcChannel Channel { get; } = GrpcChannel.ForAddress(address);
}

public class StorageGrpcChannel(string address)
{
    public GrpcChannel Channel { get; } = GrpcChannel.ForAddress(address);
}

public static class GrpcClientsConfig
{
    public static IServiceCollection AddGrpcClients(this IServiceCollection services, IConfiguration configuration)
    {
        var courseServer = configuration["GrpcServers:Course"]!;

        services.AddSingleton<CourseGrpcChannel>(provider =>
            new CourseGrpcChannel(courseServer));

        services.AddSingleton<Courses.CoursesClient>(provider =>
        {
            var channelWrapper = provider.GetRequiredService<CourseGrpcChannel>();
            return new Courses.CoursesClient(channelWrapper.Channel);
        });
        services.AddSingleton<CourseClient>();

        // --------------------------------------------------------------

        var progressServer = configuration["GrpcServers:Progress"]!;

        services.AddSingleton<ProgressGrpcChannel>(provider =>
            new ProgressGrpcChannel(progressServer));

        services.AddSingleton<Progresses.ProgressesClient>(provider =>
        {
            var channelWrapper = provider.GetRequiredService<ProgressGrpcChannel>();
            return new Progresses.ProgressesClient(channelWrapper.Channel);
        });
        services.AddSingleton<ProgressClient>();

        // --------------------------------------------------------------

        var storageServer = configuration["GrpcServers:Storage"]!;

        services.AddSingleton<StorageGrpcChannel>(provider =>
            new StorageGrpcChannel(storageServer));

        services.AddSingleton<Storages.StoragesClient>(provider =>
        {
            var channelWrapper = provider.GetRequiredService<StorageGrpcChannel>();
            return new Storages.StoragesClient(channelWrapper.Channel);
        });
        services.AddSingleton<StorageClient>();

        return services;
    }
}