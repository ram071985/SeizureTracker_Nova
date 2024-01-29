using System.Globalization;

namespace seizure_tracker.Service.Mappings;

internal static class DTOToEntity
{
    internal static Seizures MapSeiureLogDTOToEntityModel(this SeizureFormDto form)
    {
        return new()
        {
            CreatedDate = form.CreatedDate,
            TimeOfSeizure = form.TimeOfSeizure,
            AmPm = form.AmPm,
            SeizureStrength = form.SeizureStrength,
            SeizureType = form.SeizureType,
            MedicationChange = form.MedicationChange == "TRUE" ? true : form.MedicationChange == "NA" ? false : false,
            MedicationChangeExplanation = form.MedicationChangeExplanation,
            KetonesLevel = !String.IsNullOrEmpty(form.KetonesLevel) ? float.Parse(form.KetonesLevel, CultureInfo.InvariantCulture.NumberFormat) : 0.0f,
            SleepAmount = form.SleepAmount,
            Notes = form.Notes,
        };
    }
}