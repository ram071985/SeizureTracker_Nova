using Microsoft.EntityFrameworkCore;

public class SeizureContext : DbContext
{
    public DbSet<Seizure> Seizures { get; set; }

    public SeizureContext(DbContextOptions<SeizureContext> options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("SeizureTracker");
        modelBuilder.Entity<Seizure>().ToTable("Logs");
        modelBuilder.Entity<SeizuresView>().ToView("LogsByDate");
    }

    public async Task GetSeizureLogsByDate(DateTime date)
    {
        try
        {
            return Seizures.Where;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }
}