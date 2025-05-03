namespace Storage.Services.Interfaces;

public interface ISecurityService
{
    bool IsValidPdf(IFormFile file);

    bool IsFileSizeValid(IFormFile file);

    Task<bool> IsFileSafeFromMalware(IFormFile file);
}