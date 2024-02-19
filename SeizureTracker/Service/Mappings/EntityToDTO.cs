
using System.Globalization;

namespace seizure_tracker.Service;

internal static class MapSeiureLogEntityToDTO
{
    internal static SeizureFormDto MapSeizureLogEntityToDTO(this Seizure source)
    {
        return new()
        {
            ID = source.ID,
            CreatedDate = source.CreatedDate.ToString(),
            TimeOfSeizure = source.TimeOfSeizure.ToString(),
            AmPm = source.AmPm,
            SeizureStrength = source.SeizureStrength,
            KetonesLevel = source.KetonesLevel.ToString(),
            SeizureType = source.SeizureType,
            SleepAmount = source.SleepAmount,
            Notes = source.Notes,
            MedicationChange = source.MedicationChange == true ? "TRUE" : "FALSE",
            MedicationChangeExplanation = source.MedicationChangeExplanation
        };
    }

    internal static SeizureFormDto MapSeizureLogViewEntityToDTO(this SeizuresView source)
    {
        return new()
        {
            ID = source.ID,
            CreatedDate = source.CreatedDate.GetValueOrDefault().ToString("MM/dd/yy"),
            TimeOfSeizure = source.TimeOfSeizure.GetValueOrDefault().ToString("hh:mm tt"),
            AmPm = source.AmPm,
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