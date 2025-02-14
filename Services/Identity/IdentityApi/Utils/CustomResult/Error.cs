namespace IdentityApi.Utils.CustomResult;

public record Error(object Message)
{
    public static Error ValidationError(Dictionary<string, string[]> body)
    {
        return new ValidationError(body);
    }

    public static Error AuthenticationError(string body)
    {
        return new AuthenticationError(body);
    }

    public static Error NotFoundError(string body)
    {
        return new NotFoundError(body);
    }

    public static Error ConflictError(string body)
    {
        return new ConflictError(body);
    }
}

public sealed record ValidationError(Dictionary<string, string[]> Body) : Error(Body);

public sealed record AuthenticationError(string Body) : Error(Body);

public sealed record NotFoundError(string Body) : Error(Body);

public sealed record ConflictError(string Body) : Error(Body);