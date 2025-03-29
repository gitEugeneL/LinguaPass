using Microsoft.EntityFrameworkCore;

namespace Account.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
}