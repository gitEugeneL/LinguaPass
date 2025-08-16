namespace MessageBroker.Contracts;

public sealed record SendConfirmationCodeRequest(string Email, string Title, string Code);