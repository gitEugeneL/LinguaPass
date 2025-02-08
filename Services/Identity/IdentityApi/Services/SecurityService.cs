using IdentityApi.Domain.Entities;
using IdentityApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace IdentityApi.Services;

public sealed class SecurityService(IConfiguration configuration, UserManager<User> userManager) : ISecurityService
{
}