namespace Storage.Services.Interfaces;

public interface IStorageService
{
    Task<bool> BucketExists(string bucketName);

    Task<bool> CreateBucket(string bucketName);

    Task<bool> UploadFile(IFormFile file, string bucketName, string fileName, string type = "application/pdf");

    Task<List<string>> GetCustomerFiles(string bucketName);

    Task<List<string>> GetAdminFiles(string bucketName);

    Task<bool> IsFileLimitNotExceeded(string bucketName, string folderName);

    Task<bool> DeleteFile(string bucketName, string folderName, string fileName);

    Task<bool> DeleteBucket(string bucketName);
}