using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Court : Entity
{
    private Court()
    {
    }

    public Court(string name, string surface, decimal hourlyRate)
    {
        UpdateDetails(
            name,
            "standard",
            surface,
            string.Empty,
            4,
            new TimeOnly(5, 0),
            new TimeOnly(23, 0),
            hourlyRate);
    }

    public string Name { get; private set; } = string.Empty;

    public string CourtType { get; private set; } = "standard";

    public string Surface { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public int Capacity { get; private set; } = 4;

    public TimeOnly OpensAt { get; private set; } = new(5, 0);

    public TimeOnly ClosesAt { get; private set; } = new(23, 0);

    public decimal HourlyRate { get; private set; }

    public string OperationalStatus { get; private set; } = "available";

    public bool IsActive { get; private set; } = true;

    public bool IsBookable => IsActive && OperationalStatus == "available";

    public void UpdateDetails(
        string name,
        string courtType,
        string surface,
        string description,
        int capacity,
        TimeOnly opensAt,
        TimeOnly closesAt,
        decimal hourlyRate)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Court name is required.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(courtType))
        {
            throw new ArgumentException("Court type is required.", nameof(courtType));
        }

        if (string.IsNullOrWhiteSpace(surface))
        {
            throw new ArgumentException("Court surface is required.", nameof(surface));
        }

        if (capacity <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(capacity));
        }

        if (opensAt >= closesAt)
        {
            throw new ArgumentException("Opening time must be before closing time.");
        }

        if (hourlyRate < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(hourlyRate));
        }

        Name = name.Trim();
        CourtType = courtType.Trim();
        Surface = surface.Trim();
        Description = description.Trim();
        Capacity = capacity;
        OpensAt = opensAt;
        ClosesAt = closesAt;
        HourlyRate = hourlyRate;
    }

    public void SetOperationalStatus(string status)
    {
        if (status is not ("available" or "maintenance" or "paused" or "inactive"))
        {
            throw new ArgumentOutOfRangeException(nameof(status));
        }

        OperationalStatus = status;
        IsActive = status != "inactive";
    }
}
