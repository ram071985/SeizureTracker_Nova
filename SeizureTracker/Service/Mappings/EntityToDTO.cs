
namespace seizure_tracker.Service;

internal static class MapSeiureLogEntityToDTO
{
    internal static SeizureFormDto MapSeizureLogEntityToDTO(this Seizure source)
    {
        return new()
        {
            ID = source.ID,
            CreatedDate = source.CreatedDate,
            TimeOfSeizure = source.TimeOfSeizure,
            //AmPm = source.AmPm,
            SeizureStrength = source.SeizureStrength,
            KetonesLevel = source.KetonesLevel.ToString(),
            SeizureType = source.SeizureType,
            SleepAmount = source.SleepAmount,
            Notes = source.Notes,
            MedicationChange = source.MedicationChange == true ? "TRUE" : "FALSE",
            MedicationChangeExplanation = source.MedicationChangeExplanation
        };
    }
}