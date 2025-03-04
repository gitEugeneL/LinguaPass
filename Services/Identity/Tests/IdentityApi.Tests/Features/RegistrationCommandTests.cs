using FluentValidation.TestHelper;
using IdentityApi.Features.Registration;

namespace IdentityApi.Tests.Features;

public class RegistrationCommandTests
{
    private readonly Validator _validator = new();

    [Theory]
    [InlineData("test@example.com", "StrongPassword1!", "StrongPassword1!")]
    [InlineData("user@domain.com", "AnotherPass123@", "AnotherPass123@")]
    public void ValidRegistrationCommand(string email, string password, string confirmPassword)
    {
        // Arrange
        var model = new Command(email, password, confirmPassword);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "StrongPassword1!", "StrongPassword1!")] // Empty Email
    [InlineData("test@example.com", "", "StrongPassword1!")] // Empty Password
    [InlineData("test@example.com", "StrongPassword1!", "")] // Empty ConfirmPassword
    [InlineData("test@example.com", "StrongPassword1!", "WrongPassword1!")] // Mismatched Passwords
    [InlineData("notanemail", "StrongPassword1!", "StrongPassword1!")] // Invalid Email format
    [InlineData("test@example.com", "short", "short")] // Password too short
    [InlineData("test@example.com", "password", "password")] // Password without uppercase
    [InlineData("test@example.com", "PASSWORD", "PASSWORD")] // Password without lowercase
    [InlineData("test@example.com", "Password", "Password")] // Password without digits
    [InlineData("test@example.com", "Password1", "Password1")] // Password without special characters
    public void InvalidRegistrationCommand_FailsValidation(
        string email,
        string password,
        string confirmPassword)
    {
        // Arrange
        var model = new Command(email, password, confirmPassword);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveAnyValidationError();
    }
}