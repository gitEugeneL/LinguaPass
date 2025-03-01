using FluentAssertions;
using IdentityApi.Domain.Entities;
using IdentityApi.Helpers;
using IdentityApi.Services;
using Microsoft.Extensions.Configuration;

namespace IdentityApi.Tests.Services;

public class ConfirmationServiceTests
{
    private const int CodeLength = 6;
    private const int CodeLifeTimeMinutes = 5;

    private const string ValidCode = "111111";

    private static readonly User TestUser = new()
    {
        Email = "user@user.com",
        Age = 20,
        PwdHash = [],
        PwdSalt = [],
        Role = AppConstants.Customer,
        ConfirmationCode = new ConfirmationCode
        {
            Code = ValidCode,
            Expires = DateTime.UtcNow.AddMinutes(CodeLength)
        }
    };

    private readonly IConfiguration _configuration;


    public ConfirmationServiceTests()
    {
        var configurationSettings = new Dictionary<string, string?>
        {
            { "Authentication:Code.Length", CodeLength.ToString() },
            { "Authentication:Code.Lifetime.Minutes", CodeLifeTimeMinutes.ToString() }
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configurationSettings)
            .Build();
    }

    [Fact]
    public void GenerateCode_ReturnsCodeWithCorrectLength()
    {
        // Arrange
        var service = new ConfirmationService(_configuration);

        // Act
        var (code, _) = service.GenerateCode();

        // Assert
        code.Should().HaveLength(CodeLength);
    }

    [Fact]
    public void GenerateCode_ReturnExpirationTimeInFuture()
    {
        // Arrange
        var service = new ConfirmationService(_configuration);

        // Act
        var (_, expires) = service.GenerateCode();

        // Assert
        expires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(CodeLifeTimeMinutes), TimeSpan.FromSeconds(3));
    }

    [Fact]
    public void IsCodeValid_WithValidCode_ReturnsTrue()
    {
        // Arrange
        var service = new ConfirmationService(_configuration);

        // Act
        var result = service.IsCodeValid(TestUser, ValidCode);

        // Assert
        result.Should().BeTrue();
    }

    [Theory]
    [InlineData("000012")]
    [InlineData("124")]
    [InlineData("657657")]
    public void IsCodeValid_WithInvalidCode_ReturnsFalse(string code)
    {
        // Arrange
        var service = new ConfirmationService(_configuration);

        // Act
        var result = service.IsCodeValid(TestUser, code);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void IsCodeValid_WithCorrectAndExpiredCode_ReturnsFalse()
    {
        // Arrange
        var service = new ConfirmationService(_configuration);

        TestUser.ConfirmationCode!.Expires = DateTime.MinValue;

        // Act
        var result = service.IsCodeValid(TestUser, ValidCode);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void IsCodeValid_WithNullCode_ReturnsFalse()
    {
        // Arrange
        var service = new ConfirmationService(_configuration);

        TestUser.ConfirmationCode = null;

        // Act
        var result = service.IsCodeValid(TestUser, ValidCode);

        // Assert
        result.Should().BeFalse();
    }
}