using FluentValidation.TestHelper;
using IdentityApi.Features.ConfirmEmail;
using Microsoft.Extensions.Configuration;

namespace IdentityApi.Tests.Features;

public class ConfirmEmailCommandTests
{
    private readonly Validator _validator;

    public ConfirmEmailCommandTests()
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
    [InlineData("123456", "test@test.com")]
    [InlineData("123AD!", "dev@test.com")]
    public void ValidConfirmEmailCommand_PassesValidation(string code, string email)
    {
        // Arrange
        var model = new Command(code, email);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("", "test@test.com")] // Empty Code
    [InlineData("123AD!", "")] // Empty Email
    [InlineData("258963", "notanemail")] // Invalid Email
    [InlineData("25", "dev@dev.com")] // Invalid Code
    [InlineData("212312312312", "de123v@dev.com")] // Invalid Code
    public void InvalidConfirmEmailCommand_FailsValidation(string code, string email)
    {
        // Arrange
        var model = new Command(code, email);

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveAnyValidationError();
    }
}