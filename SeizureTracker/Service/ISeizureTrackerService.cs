namespace seizure_tracker.Service;

public interface ISeizureTrackerService
{
    public Task<SeizureFormReturn> GetPaginatedRecords(int pageNumber = 1);
    public Task<SeizureFormDto> AddRecord(SeizureFormDto form);
    // public Task<SeizureFormDto> CheckForKetones(string date);
    public Task<List<Seizure>> GetTotalSeizuresRecords();
    public Task<SeizureFormDto> CheckForKetones(DateTime date);
    public Task<TotalSeizuresMonthsReturn> GetTotalSeizuresForMonths(int? date, int? month);
}