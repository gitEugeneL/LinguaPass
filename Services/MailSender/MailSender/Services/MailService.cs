using System.Net;
using System.Net.Mail;
using MailSender.Services.Interfaces;

namespace MailSender.Services;

public class MailService(IConfiguration configuration) : IMailService
{
    public async Task<bool> SendMailAsync(string mailTo, string title, string body)
    {
        var section = configuration.GetSection("MailSettings");

        var host = section.GetSection("Host").Value!;
        var port = int.Parse(section.GetSection("Port").Value!);
        var username = section.GetSection("Username").Value!;
        var password = section.GetSection("Password").Value!;
        var emailFrom = section.GetSection("EmailFrom").Value!;

        try
        {
            var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            await client.SendMailAsync(emailFrom, mailTo, title, body);
            return true;
        }
        catch (Exception exception)
        {
            // log exception
            return false;
        }
    }
}