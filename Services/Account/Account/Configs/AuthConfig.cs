using System.Security.Claims;
using System.Text;
using Account.Tools;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace Account.Configs;

public static class AuthConfig
{
    public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(3),

                    ValidIssuer = configuration["Authentication:Issuer"],
                    ValidAudience = configuration["Authentication:Audience"],

                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                        .GetBytes(configuration["Authentication:AccessToken.SecurityKey"]!))
                };
            });
    }

    public static void ConfigureAuthPolicy(this IServiceCollection services)
    {
        var commonPolicy = new AuthorizationPolicyBuilder()
            .RequireClaim(ClaimTypes.Email)
            .RequireClaim(ClaimTypes.NameIdentifier)
            .RequireClaim(ClaimTypes.Role)
            .RequireClaim("isEmailConfirmed")
            .Build();

        services.AddAuthorizationBuilder()
            .AddPolicy(Constants.BasePolicy, commonPolicy)
            .AddPolicy(Constants.AdminPolicy, policy =>
            {
                policy
                    .RequireRole(Constants.AdminRole)
                    .AddRequirements(commonPolicy.Requirements.ToArray());
            })
            .AddPolicy(Constants.CustomerPolicy, policy =>
            {
                policy
                    .RequireRole(Constants.CustomerRole)
                    .AddRequirements(commonPolicy.Requirements.ToArray());
            });
    }
}