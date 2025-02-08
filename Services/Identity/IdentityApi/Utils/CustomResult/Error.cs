namespace IdentityApi.Utils.CustomResult;

public record Error(object Message, string Code)
{
    public static Error ValidationError(Dictionary<string, string[]> body)
    {
        return new ValidationError(body);
    }

    public static Error AuthenticationError(IEnumerable<string>? body)
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

public sealed record ValidationError(Dictionary<string, string[]> Body) : Error(Body, "VALIDATION_ERROR");

public sealed record AuthenticationError(IEnumerable<string> Body) : Error(Body, "AUTHENTICATION_ERROR");

public sealed record NotFoundError(string Body) : Error(Body, "NOTFOUND_ERROR");

public sealed record ConflictError(string Body) : Error(Body, "CONFLICT_ERROR");