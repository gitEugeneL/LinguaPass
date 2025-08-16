namespace Course.Features.GetDashboardInfo;

public sealed record Response(
    int CountryCount,
    int SchoolCount,
    int CourseCount,
    string TopCountry
);