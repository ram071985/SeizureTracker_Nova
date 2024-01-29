using Azure.Data.Tables;
using seizure_tracker.Service;
using Microsoft.AspNetCore.Mvc;
using Azure;

namespace seizure_tracker.Controllers;

[Route("[controller]")]
[ApiController]
public class SeizureTrackerController : ControllerBase
{

    private readonly ILogger<SeizureTrackerController> _logger;
    private readonly IConfiguration _configuration;
    private readonly ISeizureTrackerService _seizureTrackerService;


    public SeizureTrackerController(ILogger<SeizureTrackerController> logger, IConfiguration configuration, ISeizureTrackerService seizureTrackerService)
    {
        _logger = logger;
        _configuration = configuration;
        _seizureTrackerService = seizureTrackerService;
    }

    [HttpPost("records")]
    public async Task<SeizureFormReturn> GetSeizureRecords([FromBody] int page = 1)
    {
        try
        {
            var records = await _seizureTrackerService.GetPaginatedRecords(page);

            return records;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }

    }

    // [HttpGet("data/total_seizures_current_year")]
    // public async Task<TotalSeizureDataSet[]> GetTotalSeizuresRecordsForYear()
    // {
    //     try
    //     {
    //         var records = await _seizureTrackerService.GetTotalSeizuresRecords();

    //         return records;
    //     }
    //     catch (Exception ex)
    //     {
    //         Console.WriteLine(ex.Message);

    //         throw;
    //     }

    // }

    [HttpGet("data/total_seizures_months")]
    public async Task<TotalSeizuresMonthsReturn> GetTotalSeizuresRecordsForMonths()
    {
        try
        {
            var records = await _seizureTrackerService.GetTotalSeizuresForMonths(2023, 3);

            return records;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }

    }

    [HttpPost("check_ketones")]
    public async Task<SeizureFormDto> GetKetoneLevels([FromBody] string date)
    {
        try
        {
            var record = await _seizureTrackerService.CheckForKetones(date);

            return record;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }

    [HttpPost]
    public async Task AddSeizureLog([FromBody] SeizureFormDto form)
    {
        try
        {
            await _seizureTrackerService.AddRecord(form);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }
}
