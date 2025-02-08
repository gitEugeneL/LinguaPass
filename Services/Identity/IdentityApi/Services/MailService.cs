using System.Net;
using System.Net.Mail;
using IdentityApi.Services.Interfaces;

namespace IdentityApi.Services;

public class MailService(IConfiguration configuration) : IMailService
{
    public async Task<bool> SendMailAsync(string mailTo, string subject, string body)
    {
        var host = configuration.GetSection("MailSettings:Host").Value!;
        var port = int.Parse(configuration.GetSection("MailSettings:Port").Value!);
        var username = configuration.GetSection("MailSettings:Username").Value!;
        var password = configuration.GetSection("MailSettings:Password").Value!;
        var emailFrom = configuration.GetSection("MailSettings:EmailFrom").Value!;

        try
        {
            var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };
            await client.SendMailAsync(emailFrom, mailTo, subject, body);
            return true;
        }
        catch (Exception ignored)
        {
            return false;
        }
    }
}