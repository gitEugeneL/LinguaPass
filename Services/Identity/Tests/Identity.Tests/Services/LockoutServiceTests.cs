using FluentAssertions;
using IdentityApi.Services;
using Microsoft.Extensions.Configuration;

namespace IdentityApi.Tests.Services;

public class LockoutServiceTests
{
    private const int MaxAttempts = 5;
    private const int LockoutLifeTimeMinutes = 10;

    private readonly IConfiguration _configuration;


    public LockoutServiceTests()
    {
        var configurationSettings = new Dictionary<string, string?>
        {
            { "Authentication:LoginLockout.MaxAttempts", MaxAttempts.ToString() },
            { "Authentication:LoginLockout.Lifetime.Minutes", LockoutLifeTimeMinutes.ToString() },
            { "Authentication:ConfirmLockout.MaxAttempts", MaxAttempts.ToString() },
            { "Authentication:ConfirmLockout.Lifetime.Minutes", LockoutLifeTimeMinutes.ToString() },
            { "Authentication:Code.MaxAttempts", MaxAttempts.ToString() },
            { "Authentication:Code.Lifetime.Minutes", LockoutLifeTimeMinutes.ToString() }
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configurationSettings)
            .Build();
    }

    [Fact]
    public void IsLoginLocked_WithLockedAccountAndNotExpired_ReturnsTrue()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.LoginLocked = true;
        user.LoginLockExpires = DateTime.UtcNow.AddMinutes(LockoutLifeTimeMinutes);

        // Act
        var result = lockoutService.IsLoginLocked(user);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void IsLoginLocked_WithExpiredLock_ReturnsFalse()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.LoginLocked = true;
        user.LoginLockExpires = DateTime.UtcNow.AddMinutes(-1);

        // Act
        var result = lockoutService.IsLoginLocked(user);

        // Assert
        result.Should().BeFalse();
        user.LoginLocked.Should().BeFalse();
        user.LoginLockExpires.Should().BeNull();
        user.LoginFailedCount.Should().Be(0);
    }

    [Fact]
    public void IsConfirmLocked_WithLockedAccountAndNotExpired_ReturnsTrue()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.ConfirmLocked = true;
        user.ConfirmLockExpires = DateTime.UtcNow.AddMinutes(LockoutLifeTimeMinutes);

        // Act
        var result = lockoutService.IsConfirmLocked(user);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void IsConfirmLocked_WithExpiredLock_ReturnsFalse()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.ConfirmLocked = true;
        user.ConfirmLockExpires = DateTime.UtcNow.AddMinutes(-10);

        // Act
        var result = lockoutService.IsConfirmLocked(user);

        // Assert
        result.Should().BeFalse();
        user.ConfirmLocked.Should().BeFalse();
        user.ConfirmLockExpires.Should().BeNull();
        user.ConfirmFailedCount.Should().Be(0);
        user.GenerateCodeCount.Should().Be(0);
    }

    [Fact]
    public void IsLoginAttemptLimitExceeded_WithLimitExceeded_SetsLockoutAndReturnsTrue()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.LoginFailedCount = MaxAttempts + 1;

        // Act
        var result = lockoutService.IsLoginAttemptLimitExceeded(user);

        // Assert
        result.Should().BeTrue();
        user.LoginLocked.Should().BeTrue();
        user.LoginLockExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(LockoutLifeTimeMinutes), TimeSpan.FromSeconds(3));
    }

    [Fact]
    public void IsLoginAttemptLimitExceeded_WithLimitNotExceeded_ReturnsFalse()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        const int tries = 3;
        user.LoginFailedCount = tries;

        // Act
        var result = lockoutService.IsLoginAttemptLimitExceeded(user);

        // Assert
        result.Should().BeFalse();
        user.LoginLocked.Should().BeFalse();
        user.LoginFailedCount.Should().Be(tries);
    }

    [Fact]
    public void IsConfirmAttemptLimitExceeded_WithLimitExceeded_SetsLockoutAndReturnsTrue()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.ConfirmFailedCount = MaxAttempts + 1;

        // Act
        var result = lockoutService.IsConfirmAttemptLimitExceeded(user);

        // Assert
        result.Should().BeTrue();
        user.ConfirmLocked.Should().BeTrue();
        user.ConfirmLockExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(LockoutLifeTimeMinutes), TimeSpan.FromSeconds(3));
    }

    [Fact]
    public void IsConfirmAttemptLimitExceeded_WithLimitNotExceeded_ReturnsFalse()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        const int tries = 3;
        user.ConfirmFailedCount = tries;

        // Act
        var result = lockoutService.IsConfirmAttemptLimitExceeded(user);
        result.Should().BeFalse();
        user.ConfirmLocked.Should().BeFalse();
        user.ConfirmFailedCount.Should().Be(tries);
    }

    [Fact]
    public void IsGenerateCodeLimitExceeded_WithLimitExceeded_SetsLockoutAndReturnsTrue()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.GenerateCodeCount = MaxAttempts + 1;

        // Act
        var result = lockoutService.IsGenerateCodeAttemptLimitExceeded(user);

        // Assert
        result.Should().BeTrue();
        user.ConfirmLocked.Should().BeTrue();
        user.ConfirmLockExpires.Should()
            .BeCloseTo(DateTime.UtcNow.AddMinutes(LockoutLifeTimeMinutes), TimeSpan.FromSeconds(3));
    }

    [Fact]
    public void IsGenerateCodeLimitExceeded_WithLimitNotExceeded_ReturnsFalse()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        const int tries = 3;
        user.GenerateCodeCount = tries;

        // Act
        var result = lockoutService.IsConfirmAttemptLimitExceeded(user);

        // Assert
        result.Should().BeFalse();
        user.ConfirmLocked.Should().BeFalse();
        user.GenerateCodeCount.Should().Be(tries);
    }

    [Fact]
    public void ResetLoginLockout_withValidUser_ResetsLoginLockoutProperties()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.LoginLocked = true;
        user.LoginLockExpires = DateTime.UtcNow.AddMinutes(LockoutLifeTimeMinutes);
        user.LoginFailedCount = MaxAttempts + 1;

        // Act
        lockoutService.ResetLoginLockout(user);

        // Assert
        user.LoginLocked.Should().BeFalse();
        user.LoginLockExpires.Should().BeNull();
        user.LoginFailedCount.Should().Be(0);
    }

    [Fact]
    public void ResetConfirmLockout_withValidUser_ResetsLoginLockoutProperties()
    {
        // Arrange
        var lockoutService = new LockoutService(_configuration);
        var user = TestExtensions.GetFakeUser("-1", DateTime.UtcNow);
        user.ConfirmLocked = true;
        user.ConfirmLockExpires = DateTime.UtcNow.AddMinutes(LockoutLifeTimeMinutes);
        user.ConfirmFailedCount = MaxAttempts + 1;
        user.GenerateCodeCount = MaxAttempts + 1;

        // Act
        lockoutService.ResetConfirmLockout(user);

        // Assert
        user.ConfirmLocked.Should().BeFalse();
        user.ConfirmLockExpires.Should().BeNull();
        user.ConfirmFailedCount.Should().Be(0);
    }
}