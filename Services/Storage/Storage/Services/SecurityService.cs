using Storage.Helpers;
using Storage.Services.Interfaces;

namespace Storage.Services;

internal sealed class SecurityService : ISecurityService
{
    public bool IsValidPdf(IFormFile file)
    {
        // Check file extension
        if (Path.GetExtension(file.FileName).ToLower() != ".pdf")
            return false;

        // Check PDF magic number (%PDF-)
        try
        {
            using var stream = file.OpenReadStream();
            var header = new byte[4];
            stream.ReadExactly(header, 0, 4);
            return header[0] == 0x25 && // %
                   header[1] == 0x50 && // P
                   header[2] == 0x44 && // D
                   header[3] == 0x46; // F
        }
        catch
        {
            return false;
        }
    }

    public bool IsFileSizeValid(IFormFile file)
    {
        return file.Length <= StorageConstants.MaxFileSize;
    }

    public async Task<bool> IsFileSafeFromMalware(IFormFile file)
    {
        /* [!] Development check only. Should be replaced with <<ClamAV>> container in the production environment */
        try
        {
            await using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);
            var content = await reader.ReadToEndAsync();
            var maliciousPatterns = new[]
            {
                "/JavaScript",
                "/JS",
                "/OpenAction",
                "/AA",
                "/Launch"
            };
            return maliciousPatterns.All(pattern => !content.Contains(pattern, StringComparison.OrdinalIgnoreCase));
        }
        catch
        {
            return false;
        }
    }
}