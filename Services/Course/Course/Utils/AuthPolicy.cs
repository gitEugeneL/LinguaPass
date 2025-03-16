using System.Security.Claims;
using Course.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace Course.Utils;

public static class AuthPolicy
{
    public static void ConfigureAuthPolicy(this IServiceCollection services)
    {
        var commonPolicy = new AuthorizationPolicyBuilder()
            .RequireClaim(ClaimTypes.Email)
            .RequireClaim(ClaimTypes.NameIdentifier)
            .RequireClaim(ClaimTypes.Role)
            .RequireClaim("isEmailConfirmed")
            .Build();

        services.AddAuthorizationBuilder()
            .AddPolicy(AppConstants.BasePolicy, commonPolicy)
            .AddPolicy(AppConstants.AdminPolicy, policy =>
                policy
                    .RequireRole(AppConstants.AdminRole)
                    .AddRequirements(commonPolicy.Requirements.ToArray()))
            .AddPolicy(AppConstants.CustomerPolicy, policy =>
                policy
                    .RequireRole(AppConstants.CustomerRole)
                    .AddRequirements(commonPolicy.Requirements.ToArray()));
    }
}