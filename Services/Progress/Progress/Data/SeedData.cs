using System.Text.Json;
using Progress.Domain.Entities;

namespace Progress.Data;

public static class SeedData
{
    public static List<Step>? GetLanguages()
    {
        var jsonString = File.ReadAllText("Data/InitData/steps.json");
        var steps = JsonSerializer.Deserialize<List<Step>>(jsonString);
        return steps != null && steps.Count != 0 ? steps : null;
    }
}