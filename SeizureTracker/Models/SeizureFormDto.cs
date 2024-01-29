public class SeizureFormDto
{
    public int ID { get; set; }
    public DateTime? CreatedDate { get; init; } = default!;
    public DateTime? TimeOfSeizure { get; init; }
    public string? AmPm { get; set; }
    public int? SeizureStrength { get; init; }
    public string? KetonesLevel { get; set; }
    public string? SeizureType { get; set; }
    public int? SleepAmount { get; set; }
    public string? Notes { get; set; }
    public string? MedicationChange { get; set; }
    public string? MedicationChangeExplanation { get; set; }
}