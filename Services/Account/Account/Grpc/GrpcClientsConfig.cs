using Account.Grpc.Clients;
using Common.GrpcProtos;
using Grpc.Net.Client;

namespace Account.Grpc;

public static class GrpcClientsConfig
{
    public static IServiceCollection AddGrpcClients(this IServiceCollection services, IConfiguration configuration)
    {
        var courseServer = configuration["GrpcServers:Course"]!;

        services.AddSingleton(provider =>
            GrpcChannel.ForAddress(courseServer));

        services.AddSingleton<Courses.CoursesClient>(provider =>
        {
            var channel = provider.GetRequiredService<GrpcChannel>();
            return new Courses.CoursesClient(channel);
        });

        /*** Example **/
        // services.AddSingleton<OtherService.OtherServiceClient>(provider =>
        // {
        //     var channel = provider.GetRequiredService<GrpcChannel>();
        //     return new OtherService.OtherServiceClient(channel);
        // });
        // services.AddSingleton<OtherClient>();

        services.AddSingleton<CourseClient>();

        return services;
    }
}