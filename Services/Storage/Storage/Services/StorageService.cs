using System.Reactive.Linq;
using Minio;
using Minio.ApiEndpoints;
using Minio.DataModel.Args;
using Storage.Helpers;
using Storage.Services.Interfaces;

namespace Storage.Services;

public class StorageService(IMinioClient minioClient) : IStorageService
{
    public async Task<bool> BucketExists(string bucketName)
    {
        return await minioClient.BucketExistsAsync(
            new BucketExistsArgs()
                .WithBucket(bucketName.ToLowerInvariant()));
    }

    public async Task<bool> CreateBucket(string bucketName)
    {
        try
        {
            await minioClient.MakeBucketAsync(
                new MakeBucketArgs()
                    .WithBucket(bucketName.ToLowerInvariant()));
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UploadFile(
        IFormFile file,
        string bucketName,
        string fileName,
        string type = "application/pdf")
    {
        await using var stream = file.OpenReadStream();
        var size = file.Length;

        try
        {
            await minioClient.PutObjectAsync(
                new PutObjectArgs()
                    .WithBucket(bucketName.ToLowerInvariant())
                    .WithObject(fileName.ToLowerInvariant())
                    .WithObjectSize(size)
                    .WithStreamData(stream)
                    .WithContentType(type)
            );
            return true;
        }
        catch
        {
            return false;
        }
    }

    public Task<List<string>> GetCustomerFiles(string bucketName)
    {
        return GetFileNames(bucketName, StorageConstants.CustomerFilesFolder);
    }

    public Task<List<string>> GetAdminFiles(string bucketName)
    {
        return GetFileNames(bucketName, StorageConstants.AdminFilesFolder);
    }

    public async Task<bool> IsFileLimitNotExceeded(string bucketName, string folderName)
    {
        return folderName switch
        {
            StorageConstants.CustomerFilesFolder =>
                (await GetCustomerFiles(bucketName)).Count < StorageConstants.MaxCustomerFiles,

            StorageConstants.AdminFilesFolder =>
                (await GetAdminFiles(bucketName)).Count < StorageConstants.MaxAdminFiles,

            _ => throw new ArgumentException("Invalid folder name", nameof(folderName))
        };
    }

    public async Task<bool> DeleteFile(string bucketName, string folderName, string fileName)
    {
        try
        {
            await minioClient.RemoveObjectAsync(
                new RemoveObjectArgs()
                    .WithBucket(bucketName.ToLowerInvariant())
                    .WithObject($"{folderName.ToLowerInvariant()}/{fileName.ToLowerInvariant()}")
            );
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteBucket(string bucketName)
    {
        try
        {
            await minioClient.RemoveBucketAsync(
                new RemoveBucketArgs()
                    .WithBucket(bucketName.ToLowerInvariant()));
            return true;
        }
        catch
        {
            return false;
        }
    }

    private async Task<List<string>> GetFileNames(string bucketName, string folderName)
    {
        List<string> itemNames = [];

        var args = new ListObjectsArgs()
            .WithBucket(bucketName.ToLowerInvariant())
            .WithPrefix(folderName.ToLowerInvariant() + "/");

        var observable = minioClient.ListObjectsAsync(args);
        await observable.ForEachAsync(item => itemNames.Add(item.Key));

        return itemNames;
    }
}