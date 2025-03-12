using FluentValidation.TestHelper;
using IdentityApi.Features.GenerateCode;

namespace IdentityApi.Tests.Features;

public class GenerateCodeCommandTests
{
    private readonly Validator _validator = new();

    [Theory]
    [InlineData("test@example.com")]
    [InlineData("mail@example.com")]
    public void ValidGenerateCodeCommand_PassesValidation(string email)
    {
        // Arrange
        var model = new Command(email);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")] // Empty Email
    [InlineData("notanemail")] // Invalid Email form
    public void InvalidGenerateCodeCommand_FailsValidation(string email)
    {
        // Arrange
        var model = new Command(email);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveAnyValidationError();
    }
}