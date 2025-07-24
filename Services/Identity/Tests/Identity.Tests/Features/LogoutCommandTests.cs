using FluentValidation.TestHelper;
using IdentityApi.Features.Logout;

namespace IdentityApi.Tests.Features;

public class LogoutCommandTests
{
    private readonly Validator _validator = new();

    [Theory]
    [InlineData("validRefreshToken123", "00000000-0000-0000-0000-000000000001")]
    [InlineData("anotherValidToken456", "00000000-0000-0000-0000-000000000002")]
    [InlineData("secureRefreshToken789$", "00000000-0000-0000-0000-000000000003")]
    public void ValidLogoutCommand_PassesValidation(string token, Guid userId, string clientRole = "CUSTOMER")
    {
        // Arrange
        var model = new Command(token, userId, clientRole);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "00000000-0000-0000-0000-000000000001")] // Empty Token
    [InlineData("anotherValidToken456", "00000000-0000-0000-0000-000000000000")] // Empty UserId
    public void InvalidLogoutCommand_FailsValidation(string token, Guid userId, string clientRole = "CUSTOMER")
    {
        // Arrange
        var model = new Command(token, userId, clientRole);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveAnyValidationError();
    }
}