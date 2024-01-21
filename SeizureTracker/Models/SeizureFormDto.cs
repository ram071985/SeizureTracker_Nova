public class SeizureFormDto
{
    public int ID { get; set; }
    public string CreatedDate { get; init; } = default!;
    public string TimeOfSeizure { get; init; }
    public string AmPm { get; set; }
    public int SeizureStrength { get; init; }
    public string KetonesLevel { get; set; }
    public string SeizureType { get; set; }
    public int SleepAmount { get; set; }
    public string Notes { get; set; }
    public string MedicationChange { get; set; }
    public string MedicationChangeExplanation { get; set; }
}