namespace Account.Domain.Entities;

public sealed class Address
{
    public Guid Id { get; init; }
    public required string Street { get; set; }
    public required string HsApt { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }
    public required string Postcode { get; set; }

    public required string CorrStreet { get; set; }
    public required string CorrHsApt { get; set; }
    public required string CorrCity { get; set; }
    public required string CorrCountry { get; set; }
    public required string CorrPostcode { get; set; }

    /*** Relations **/
    public List<CustomerContact> Contacts { get; init; } = [];
}