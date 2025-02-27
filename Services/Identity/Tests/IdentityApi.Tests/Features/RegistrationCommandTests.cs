using FluentValidation.TestHelper;
using IdentityApi.Features.Registration;

namespace IdentityApi.Tests.Features;

public class RegistrationCommandTests
{
    private readonly Validator _validator = new();

    [Theory]
    [InlineData("test@example.com", "StrongPassword1!", "StrongPassword1!", 25)]
    [InlineData("user@domain.com", "AnotherPass123@", "AnotherPass123@", 30)]
    public void ValidRegistrationCommand(string email, string password, string confirmPassword, int age)
    {
        // Arrange
        var model = new Command(email, password, confirmPassword, age);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "StrongPassword1!", "StrongPassword1!", 25)] // Empty Email
    [InlineData("test@example.com", "", "StrongPassword1!", 25)] // Empty Password
    [InlineData("test@example.com", "StrongPassword1!", "", 25)] // Empty ConfirmPassword
    [InlineData("test@example.com", "StrongPassword1!", "WrongPassword1!", 25)] // Mismatched Passwords
    [InlineData("notanemail", "StrongPassword1!", "StrongPassword1!", 25)] // Invalid Email format
    [InlineData("test@example.com", "short", "short", 25)] // Password too short
    [InlineData("test@example.com", "password", "password", 25)] // Password without uppercase
    [InlineData("test@example.com", "PASSWORD", "PASSWORD", 25)] // Password without lowercase
    [InlineData("test@example.com", "Password", "Password", 25)] // Password without digits
    [InlineData("test@example.com", "Password1", "Password1", 25)] // Password without special characters
    [InlineData("test@example.com", "StrongPassword1!", "StrongPassword1!", 17)] // Age below minimum
    [InlineData("test@example.com", "StrongPassword1!", "StrongPassword1!", 121)] // Age above maximum
    public void InvalidRegistrationCommand_FailsValidation(
        string email,
        string password,
        string confirmPassword,
        int age)
    {
        // Arrange
        var model = new Command(email, password, confirmPassword, age);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveAnyValidationError();
    }
}