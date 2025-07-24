using FluentAssertions;
using IdentityApi.Tools;
using Microsoft.AspNetCore.Http;
using Moq;

namespace IdentityApi.Tests.Utils;

public class CookieSetterTests
{
    // private const string RefreshCookie = "refreshTokenCustomer";
    private readonly Mock<HttpContext> _httpContextMock = new();
    private readonly Mock<HttpRequest> _httpRequestMock = new();
    private readonly Mock<HttpResponse> _httpResponseMock = new();
    private readonly Mock<IResponseCookies> _responseCookiesMock = new();

    public CookieSetterTests()
    {
        _httpContextMock.SetupGet(c => c.Request).Returns(_httpRequestMock.Object);
        _httpContextMock.SetupGet(c => c.Response).Returns(_httpResponseMock.Object);
        _httpResponseMock.SetupGet(r => r.Cookies).Returns(_responseCookiesMock.Object);
    }

    [Theory]
    [InlineData("CUSTOMER")]
    [InlineData("ADMIN")]
    public void SetCookie_ShouldAppendCookieWithCorrectOptions(string clientRole)
    {
        // Arrange
        var refreshToken = "test-refresh-token";
        var expires = DateTime.UtcNow.AddDays(7);

        // Act
        CookieSetter.SetCookie(_httpContextMock.Object, refreshToken, expires, clientRole);

        // Assert

        _responseCookiesMock.Verify(
            c => c.Append(
                clientRole == "ADMIN" ? "refreshTokenManager" : "refreshTokenCustomer",
                refreshToken,
                It.Is<CookieOptions>(options =>
                    options.HttpOnly == true &&
                    options.Secure == true &&
                    options.SameSite == SameSiteMode.Strict &&
                    options.Expires == expires
                )
            ),
            Times.Once
        );
    }

    [Theory]
    [InlineData("CUSTOMER")]
    [InlineData("ADMIN")]
    public void ReadCookie_ShouldReturnNull_WhenCookieDoesNotExist(string clientRole)
    {
        // Arrange
        _httpRequestMock
            .Setup(r => r.Cookies[clientRole == "ADMIN" ? "refreshTokenManager" : "refreshTokenCustomer"])
            .Returns((string?)null);

        // Act
        var result = CookieSetter.ReadCookie(_httpContextMock.Object, clientRole);

        // Assert
        result.Should().BeNull();
    }

    [Theory]
    [InlineData("CUSTOMER")]
    [InlineData("ADMIN")]
    public void RemoveCookie_ShouldDeleteCookie(string clientRole)
    {
        // Act
        CookieSetter.RemoveCookie(_httpContextMock.Object, clientRole);

        // Assert
        _responseCookiesMock.Verify(
            c => c.Delete(clientRole == "ADMIN" ? "refreshTokenManager" : "refreshTokenCustomer"),
            Times.Once
        );
    }
}