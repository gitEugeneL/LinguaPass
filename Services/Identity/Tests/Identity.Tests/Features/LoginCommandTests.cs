using FluentValidation.TestHelper;
using IdentityApi.Features.Login;

namespace IdentityApi.Tests.Features;

public class LoginCommandTests
{
    private readonly Validator _validator = new();

    [Theory]
    [InlineData("test@example.com", "strongPassword1@")]
    [InlineData("mail@example.com", "devDev123!^%$")]
    public void ValidLoginCommand_PassesValidation(string email, string password)
    {
        // Arrange
        var model = new Command(email, password);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "password")] // Empty Email
    [InlineData("test@example.com", "")] // Empty Password
    [InlineData("notanemail", "strongPassword1@")] // Invalid Email format
    [InlineData("test@example.com", "short")] // Password too short
    public void InvalidLoginCommand_FailsValidation(string email, string password)
    {
        // Arrange
        var model = new Command(email, password);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveAnyValidationError();
    }
}