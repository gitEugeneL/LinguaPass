namespace Storage.Helpers;

public static class StorageConstants
{
    public const long MaxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    public const int MaxCustomerFiles = 5;
    public const int MaxAdminFiles = 5;
    public const string CustomerFilesFolder = "customerFiles";
    public const string AdminFilesFolder = "adminFiles";
}