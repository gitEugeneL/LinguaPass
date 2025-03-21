using System.Text.Json;
using Course.Domain.Entities;

namespace Course.Data;

public static class SeedData
{
    public static List<Language>? GetLanguages()
    {
        var jsonString = File.ReadAllText("Data/InitData/languages.json");
        var languages = JsonSerializer.Deserialize<List<Language>>(jsonString);
        return languages != null && languages.Count != 0 ? languages : null;
    }
}