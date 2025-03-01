using FluentAssertions;
using IdentityApi.Services;

namespace IdentityApi.Tests.Services;

public class PasswordServiceTests
{
    [Theory]
    [InlineData("StrongPassword")]
    [InlineData("password!@3!@#")]
    public void CreatePasswordHash_WithValidPassword_GeneratesHashAndSalt(string password)
    {
        // Arrange
        var passwordManager = new PasswordService();

        // Act
        passwordManager.CreatePasswordHash(password, out var hash, out var salt);

        // Assert
        hash.Should().NotBeNull();
        salt.Should().NotBeNull();
    }

    [Theory]
    [InlineData("StrongPassword")]
    [InlineData("password!@3!@#")]
    [InlineData("Psw!@3!232-3")]
    [InlineData("123!@#@#12asdASD")]
    public void VerifyPasswordHash_WithCorrectPassword_ReturnsTrue(string password)
    {
        // Arrange
        var passwordManager = new PasswordService();
        passwordManager.CreatePasswordHash(password, out var hash, out var salt);

        // Act
        var result = passwordManager.VerifyPasswordHash(password, hash, salt);

        // Assert
        result.Should().BeTrue();
    }

    [Theory]
    [InlineData("StrongPassword")]
    [InlineData("password!@3!@#")]
    [InlineData("Psw!@3!232-3")]
    [InlineData("123!@#@#12asdASD")]
    public void VerifyPasswordHash_WithIncorrectPassword_ReturnsTrue(string password)
    {
        // Arrange
        var passwordManager = new PasswordService();
        passwordManager.CreatePasswordHash("invalid-password", out var hash, out var salt);

        // Act
        var result = passwordManager.VerifyPasswordHash(password, hash, salt);

        // Assert
        result.Should().BeFalse();
    }
}