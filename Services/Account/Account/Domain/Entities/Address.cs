namespace Account.Domain.Entities;

public sealed class Address
{
    public Guid Id { get; init; }
    public string Street { get; set; } = string.Empty;
    public string HsApt { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;

    public string? CorrStreet { get; set; } = string.Empty;
    public string? CorrHsApt { get; set; } = string.Empty;
    public string? CorrCity { get; set; } = string.Empty;
    public string? CorrCountry { get; set; } = string.Empty;
    public string? CorrPostcode { get; set; } = string.Empty;

    /*** Relations **/
    public List<CustomerContact> Contacts { get; init; } = [];
}