using FluentValidation.TestHelper;
using IdentityApi.Features.ResetPassword;
using Microsoft.Extensions.Configuration;

namespace IdentityApi.Tests.Features;

public class ResetPasswordCommandTests
{
    private readonly Validator _validator;

    public ResetPasswordCommandTests()
    {
        // Fake configuration file
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "Authentication:Code.Length", "6" }
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        _validator = new Validator(configuration);
    }

    [Theory]
    [InlineData("test@test.com", "123456", "StrongPassword1!", "StrongPassword1!")]
    [InlineData("dev@test.com", "123AD!", "AnotherPass123@", "AnotherPass123@")]
    public void ValidResetPasswordCommand_PassesValidation(
        string email,
        string code,
        string password,
        string confirmPassword)
    {
        // Arrange
        var model = new Command(email, code, password, confirmPassword);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "123AD!", "StrongPassword1!", "StrongPassword1!")] // Empty Email
    [InlineData("test@example.com", "258963", "", "StrongPassword1!")] // Empty Password
    [InlineData("test@example.com", "123654", "StrongPassword1!", "")] // Empty ConfirmPassword
    [InlineData("test@example.com", "123587", "StrongPassword1!", "WrongPassword1!")] // Mismatched Passwords
    [InlineData("notanemail", "147896", "StrongPassword1!", "StrongPassword1!")] // Invalid Email format
    [InlineData("test@example.com", "123654", "short", "short")] // Password too short
    [InlineData("test@example.com", "123528", "password", "password")] // Password without uppercase
    [InlineData("test@example.com", "458741", "PASSWORD", "PASSWORD")] // Password without lowercase
    [InlineData("test@example.com", "1258963", "Password", "Password")] // Password without digits
    [InlineData("test@example.com", "123654", "Password1", "Password1")] // Password without special characters
    [InlineData("test@test.com", "", "StrongPassword1!", "StrongPassword1!")] // Empty Code
    [InlineData("dev@test.com", "132246587645", "AnotherPass123@", "AnotherPass123@")] // Invalid Code
    [InlineData("dev@test.com", "132", "AnotherPass123@", "AnotherPass123@")] // Invalid Code
    public void InvalidResetPasswordCommand_FailsValidation(
        string email,
        string code,
        string password,
        string confirmPassword)
    {
        // Arrange
        var model = new Command(email, code, password, confirmPassword);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveAnyValidationError();
    }
}