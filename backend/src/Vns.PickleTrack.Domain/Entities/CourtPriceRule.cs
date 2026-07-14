using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class CourtPriceRule : Entity
{
    private CourtPriceRule()
    {
    }

    public CourtPriceRule(
        Guid courtId,
        string customerType,
        string dayType,
        string priceType,
        TimeOnly startTime,
        TimeOnly endTime,
        decimal hourlyRate,
        DateOnly effectiveFrom,
        string holidayDates,
        string createdBy)
    {
        CourtId = courtId;
        CustomerType = customerType;
        DayType = dayType;
        PriceType = priceType;
        StartTime = startTime;
        EndTime = endTime;
        HourlyRate = hourlyRate;
        EffectiveFrom = effectiveFrom;
        HolidayDates = holidayDates;
        CreatedBy = createdBy;
    }

    public Guid CourtId { get; private set; }
    public string CustomerType { get; private set; } = string.Empty;
    public string DayType { get; private set; } = string.Empty;
    public string PriceType { get; private set; } = "regular";
    public TimeOnly StartTime { get; private set; }
    public TimeOnly EndTime { get; private set; }
    public decimal HourlyRate { get; private set; }
    public DateOnly EffectiveFrom { get; private set; }
    public string HolidayDates { get; private set; } = string.Empty;
    public string CreatedBy { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;

    public void Update(
        Guid courtId,
        string customerType,
        string dayType,
        string priceType,
        TimeOnly startTime,
        TimeOnly endTime,
        decimal hourlyRate,
        DateOnly effectiveFrom,
        string holidayDates)
    {
        CourtId = courtId;
        CustomerType = customerType;
        DayType = dayType;
        PriceType = priceType;
        StartTime = startTime;
        EndTime = endTime;
        HourlyRate = hourlyRate;
        EffectiveFrom = effectiveFrom;
        HolidayDates = holidayDates;
        MarkUpdated();
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        MarkUpdated();
    }
}
