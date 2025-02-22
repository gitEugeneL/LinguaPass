using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace IdentityApi.Helpers;

public static class JwtAuthPolicy
{
    public static void Configure(this IServiceCollection services)
    {
        var commonPolicy = new AuthorizationPolicyBuilder()
            .RequireClaim(ClaimTypes.Email)
            .RequireClaim(ClaimTypes.NameIdentifier)
            .RequireClaim(ClaimTypes.Role)
            .RequireClaim("isEmailConfirmed")
            .Build();

        services.AddAuthorizationBuilder()
            .AddPolicy(AppConstants.CustomerRole, commonPolicy)
            .AddPolicy(AppConstants.AdminRole, commonPolicy);


        // todo add 


        // var authConfiguration = builder.Configuration.GetSection("Authentication");
// builder.Services.AddAuthentication(options =>
// {
// options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
// options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
// options.TokenValidationParameters = new TokenValidationParameters
// {
// ValidateAudience = false, //
// ValidateIssuer = false, //
// ValidateIssuerSigningKey = true,
// ValidateLifetime = true,
// ValidAudience = authConfiguration.GetSection("Audience").Value,
// ValidIssuer = authConfiguration.GetSection("Issuer").Value,
// IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
// .GetBytes(authConfiguration.GetSection("AccessToken.SecurityKey").Value!))
// };
// });
    }
}