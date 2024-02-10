using System.Globalization;

namespace seizure_tracker.Service.Mappings;

internal static class DTOToEntity
{
    internal static Seizure MapSeiureLogDTOToEntityModel(this SeizureFormDto form)
    {
        decimal check;
        Decimal.TryParse(form.KetonesLevel, out check);
        return new()
        {
            CreatedDate = form.CreatedDate,
            TimeOfSeizure = form.TimeOfSeizure,
            AmPm = form.AmPm,
            SeizureStrength = form.SeizureStrength,
            SeizureType = form.SeizureType,
            MedicationChange = form.MedicationChange == "TRUE" ? true : form.MedicationChange == "NA" ? false : false,
            MedicationChangeExplanation = form.MedicationChangeExplanation,
            KetonesLevel = !String.IsNullOrEmpty(form.KetonesLevel) ?  check : 0,
            SleepAmount = form.SleepAmount,
            Notes = form.Notes,
        };
    }
}