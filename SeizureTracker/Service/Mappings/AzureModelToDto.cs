namespace seizure_tracker.Service.Mappings;

internal static class AzureModelToDto
{
    internal static SeizureFormDto MapToSeizureFormDto(this SeizureForm form)
    {
        return new()
        {
            SeizureStrength = form.SeizureStrength,
            SeizureType = form.SeizureType,
            MedicationChange = form.MedicationChange,
            MedicationChangeExplanation = form.MedicationChangeExplanation,
            KetonesLevel = form.KetonesLevel.ToString("0.0"),
            SleepAmount = form.SleepAmount,
            Notes = form.Notes,
            AmPm = form.AmPm,        
        };
    }

    internal static SeizureFormDto MapSeiureLogEntityToDTO(this Seizures form)
    {
        return new()
        {
            CreatedDate = form.CreatedDate,
            TimeOfSeizure = form.TimeOfSeizure,
            AmPm = form.AmPm,
            SeizureStrength = form.SeizureStrength,
            SeizureType = form.SeizureType,
            MedicationChange = form.MedicationChange == true ? "TRUE" : "NA",
            MedicationChangeExplanation = form.MedicationChangeExplanation,
            KetonesLevel = !String.IsNullOrEmpty(form.KetonesLevel.ToString()) ? form.KetonesLevel.ToString() : "0.0",
            SleepAmount = form.SleepAmount,
            Notes = form.Notes,
        };
    }
}