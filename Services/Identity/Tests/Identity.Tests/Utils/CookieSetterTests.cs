using FluentAssertions;
using IdentityApi.Tools;
using Microsoft.AspNetCore.Http;
using Moq;

namespace IdentityApi.Tests.Utils;

public class CookieSetterTests
{
    private const string RefreshCookie = "refreshToken";
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

    [Fact]
    public void SetCookie_ShouldAppendCookieWithCorrectOptions()
    {
        // Arrange
        var refreshToken = "test-refresh-token";
        var expires = DateTime.UtcNow.AddDays(7);

        // Act
        CookieSetter.SetCookie(_httpContextMock.Object, refreshToken, expires);

        // Assert
        _responseCookiesMock.Verify(
            c => c.Append(
                RefreshCookie,
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

    [Fact]
    public void ReadCookie_ShouldReturnNull_WhenCookieDoesNotExist()
    {
        // Arrange
        _httpRequestMock.Setup(r => r.Cookies[RefreshCookie]).Returns((string?)null);

        // Act
        var result = CookieSetter.ReadCookie(_httpContextMock.Object);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public void RemoveCookie_ShouldDeleteCookie()
    {
        // Act
        CookieSetter.RemoveCookie(_httpContextMock.Object);

        // Assert
        _responseCookiesMock.Verify(
            c => c.Delete(RefreshCookie),
            Times.Once
        );
    }
}