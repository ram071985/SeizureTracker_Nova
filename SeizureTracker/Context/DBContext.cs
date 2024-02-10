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

   // public async GetSei

    public async Task<List<Seizure>> GetSeizureLogsByDate(DateTime date)
    {
        try
        {
            return await Seizures.Where(x => x.CreatedDate.Value.Date == date.Date).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }

    public async Task AddSeizureLog(Seizure log)
    {
        try
        {
            await Seizures.AddAsync(log);

            await SaveChangesAsync();
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }
}