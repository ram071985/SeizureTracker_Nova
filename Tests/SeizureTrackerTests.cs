using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.Extensions.Configuration;
using seizure_tracker.Service;
using seizure_tracker.Context;

namespace Tests;

public class Tests
{
    private DbContextOptions<SeizureContext> _options;
    private SeizureTrackerService _seizureTrackerService { get; set; }
    private IConfigurationRoot _config;
    private SeizureContext _context;

    [SetUp]
    public void Setup()
    {
        _config = TestHelper.GetIConfigurationRoot();

        getProxyContext();

        _seizureTrackerService = new SeizureTrackerService(_config, _context);
    }

    [Test]
    public async Task GetSeizureLogs()
    {
        try
        {
            var seizureLogs = await _context.Seizures.ToListAsync();

            Assert.IsInstanceOf<List<Seizure>>(seizureLogs);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    [Test]
    public async Task CheckForKetonesTest()
    {
        try
        {
            var seizureLog = await _seizureTrackerService.CheckForKetones(new DateTime(2024,2,9));

            Assert.IsInstanceOf<Seizure>(seizureLog);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    // [Test]
    // public async Task AddSeizureLog()
    // {
    //     try
    //     {
    //         var seizureLog = new Seizures
    //         {
    //             SeizureDate = DateTime.Now,
    //             SeizureTime = DateTime.Now,
    //             SeizureStrength = 1,
    //             KetonesLevel = 3.4m,
    //             SeizureType = "Partial",
    //             SleepAmountInHours = 8,
    //             Notes = "at work while sitting at desk",
    //             CreatedDate = DateTime.Now
    //         };

    //        await _context.Seizures.AddAsync(seizureLog);
    //        await _context.SaveChangesAsync();

    //     }
    //     catch (Exception ex)
    //     {
    //         Console.WriteLine(ex.Message);
    //     }
    // }

    private void getProxyContext()
    {
        _options = new DbContextOptionsBuilder<SeizureContext>().UseSqlServer(_config.GetSection("ConnectionStrings").GetValue<string>("DB")).Options;

        _context = new SeizureContext(_options);
    }
}
