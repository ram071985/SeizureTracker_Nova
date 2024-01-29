namespace seizure_tracker.Service;

public interface ISeizureTrackerService
{
    public Task<SeizureFormReturn> GetPaginatedRecords(int pageNumber = 1);
    public Task AddRecord(SeizureFormDto form);
    public Task<SeizureFormDto> CheckForKetones(string date);
    public Task<List<Seizures>> GetTotalSeizuresRecords();
    public Task<TotalSeizuresMonthsReturn> GetTotalSeizuresForMonths(int? date, int? month);
}