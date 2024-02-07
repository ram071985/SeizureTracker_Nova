using Microsoft.Extensions.Logging.EventLog;
using seizure_tracker.Service.Mappings;
namespace seizure_tracker.Service;

public class SeizureTrackerService : ISeizureTrackerService
{
    private readonly IConfiguration _config;
    private readonly IAzureTableService _azureTableService;
    private readonly SeizureContext _context;
    private string _filter;
    private int _pageCount;

    #region  Construction
    public SeizureTrackerService(IConfiguration config, SeizureContext context)
    {
        _config = config;
        _context = context;
        _filter = "";
        _pageCount = int.Parse(_config["Pagination:PageCount"]);
    }
    #endregion

    #region Public Methods
    public async Task<SeizureFormReturn> GetPaginatedRecords(int pageNumber = 1)
    {
        SeizureFormReturn seizures = new();
        try
        {
            var parseRecords = await mapRecords(null);

            return paginateRecords(parseRecords, pageNumber);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }

    public async Task<List<Seizure>> GetTotalSeizuresRecords()
    {
        List<TotalSeizureDataSet> totalSeizureSet = new();

        try
        {
            var seizures = _context.Seizures.ToList();
            return seizures;
            // var parseRecords = await mapRecords(null);

            // var groupByDate = parseRecords.Where(x => DateTime.Parse(x.Date).Year == DateTime.Now.Year).GroupBy(r => DateTime.Parse(r.Date).Date).Select(g => g.ToList());

            // var orderBy = groupByDate.ToList();

            // totalSeizureSet = filterSeizureCount(orderBy);

            // totalSeizureSet.Reverse();

            // return totalSeizureSet.ToArray();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }

    public async Task<TotalSeizuresMonthsReturn> GetTotalSeizuresForMonths(int? yearFilter, int? monthFilter)
    {
        TotalSeizuresMonthsReturn totalSeizuresMonthsReturn = new();
        List<TotalSeizureDataSet> totalSeizureSet = new();
        List<List<SeizureFormDto>> seizureForm;

        try
        {
            var parseRecords = await mapRecords();

            // if (yearFilter is not null || monthFilter is not null)
            // {
            //     seizureForm = parseRecords.Where(x => x.CreatedDate == yearFilter).GroupBy(r => DateTime.Parse(r.CreatedDate).Date).Select(g => g.ToList()).ToList();

            //     var filtered = filterSeizureCount(seizureForm);

            //     var months = filtered.GroupBy(m => DateTime.Parse(m.Date).Month).Select(x => x.ToList()).ToList();

            //     totalSeizuresMonthsReturn.Months = months.Select(x => DateTime.Parse(x.FirstOrDefault().Date).Month).ToArray();

            //     totalSeizuresMonthsReturn.DataSet = months.FirstOrDefault(x => DateTime.Parse(x.FirstOrDefault().Date).Month == monthFilter).Select(y => y).ToArray();
            // }
            // else
            // {
            //     seizureForm = parseRecords.GroupBy(r => DateTime.Parse(r.CreatedDate).Date.Year).Select(g => g.ToList()).ToList();

            //     var getYears = seizureForm.Select(x => DateTime.Parse(x.FirstOrDefault().CreatedDate).Year).ToArray();

            //     totalSeizuresMonthsReturn.Years = getYears;
            // }

            // var filterMonths = totalSeizureSet.Where(x => DateTime.Parse(x.Date).Year == date).ToList();
            return totalSeizuresMonthsReturn;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }

    public async Task<SeizureFormDto> CheckForKetones(DateTime date)
    {
        SeizureFormDto seizure = new();

        _filter = $"Date eq datetime'{date}'";

        try
        {
            var records = await getSeizureLogsByDate(date);

            if (!records.Any())
                return seizure;

            var parseRecords = records.Select(r => r.MapSeizureLogEntityToDTO()).ToList();

            seizure = parseRecords.OrderByDescending(x => double.Parse(x.KetonesLevel)).FirstOrDefault();

            return seizure;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }

    public async Task<SeizureFormDto> AddRecord(SeizureFormDto form)
    {
        try
        {
            var log = form.MapSeiureLogDTOToEntityModel();

            await addSeizureLog(log);

            return log.MapSeizureLogEntityToDTO();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            throw;
        }
    }
    #endregion
    #region Private Methods
    private IEnumerable<DateTime> eachDay(DateTime from, DateTime thru)
    {
        for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
            yield return day;
    }

    private List<TotalSeizureDataSet> filterSeizureCount(List<List<SeizureFormDto>> groups)
    {
        try
        {
            List<TotalSeizureDataSet> filtered = new();

            var totalSeizureSet = getTotalSeizureDateGroups(groups);

            // add last group item
            //     filtered.Add(totalSeizureSet[totalSeizureSet.Count - 1]);

            return processSeizureCount(totalSeizureSet).Where(x => DateTime.Parse(x.Date).Year.ToString() == DateTime.Now.Year.ToString()).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }

    private List<TotalSeizureDataSet> getTotalSeizureDateGroups(List<List<SeizureFormDto>> groups)
    {
        List<TotalSeizureDataSet> totalSeizureSet = new();

        foreach (var date in groups)
        {
            var set = new TotalSeizureDataSet()
            {
                Date = date[0].CreatedDate?.ToString("MMMM dd"),
                Amount = date.Count
            };

            totalSeizureSet.Add(set);
        }

        return totalSeizureSet;
    }

    private List<TotalSeizureDataSet> processSeizureCount(List<TotalSeizureDataSet> totalSeizureSet)
    {
        for (int i = 0; i < totalSeizureSet.Count - 1; i++)
        {
            DateTime? current = DateTime.Parse(totalSeizureSet[i].Date).Date;
            DateTime? next = DateTime.Parse(totalSeizureSet[i + 1].Date).Date;
            string expectedNext = current?.AddDays(-1).Date.ToString("MMMM dd");

            if (next != DateTime.Parse(expectedNext).Date)
            {
                totalSeizureSet.Insert(i + 1, new TotalSeizureDataSet { Date = expectedNext, Amount = 0 });
            }
        }

        return totalSeizureSet;
    }

    private async Task<List<SeizureFormDto>> mapRecords(string? filter = "")
    {
        List<SeizureFormDto> seizures = new();

        try
        {
            var records = await getRecords(filter);

            if (!records.Any())
                return seizures;
            return records.Select(r => r.MapToSeizureFormDto()).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }
    private SeizureFormReturn paginateRecords(List<SeizureFormDto> records, int pageNumber)
    {
        SeizureFormReturn seizures = new();
        seizures.Seizures = new();

        var groupByDate = records.GroupBy(r => r.CreatedDate).Select(g => g.ToList());

        var groups = groupByDate.ToList();

        var skip = _pageCount * (pageNumber - 1);

        seizures.Seizures = groupByDate.Select(x => x).Skip(skip).Take(_pageCount).ToList();

        var pageCount = groupByDate.Count() > 10 ? (double)groupByDate.Count() / 10 : 1;

        seizures.PageCount = pageCount;

        return seizures;
    }
    private async Task addSeizureLog(Seizure log) => await _context.AddSeizureLog(log);
    private async Task<List<Seizure>> getSeizureLogsByDate(DateTime date) => await _context.GetSeizureLogsByDate(date);
    private async Task<List<SeizureForm>> getRecords(string queryFilter) => await _azureTableService.GetRecords(queryFilter);
    private async Task<List<SeizureForm>> getDateRecords(string date) => await _azureTableService.GetRecordsByDate(date);
    private async Task<SeizureForm> addRecord(SeizureForm form) => await _azureTableService.AddRecord(form);
    #endregion
}