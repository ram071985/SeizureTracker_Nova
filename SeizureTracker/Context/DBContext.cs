using Microsoft.EntityFrameworkCore;

public class SeizureContext : DbContext
{
    public DbSet<Seizures> Seizures { get; set;}

    public SeizureContext(DbContextOptions<SeizureContext> options) : base(options)
    {
        
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("SeizureTracker");
        modelBuilder.Entity<Seizures>().ToView("LogsByDate");
    }
}