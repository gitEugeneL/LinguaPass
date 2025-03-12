using IdentityApi.Domain.Entities;

namespace IdentityApi.Services.Interfaces;

public interface IConfirmationService
{
    (string code, DateTime expires) GenerateCode();

    bool IsCodeValid(User user, string code);
}