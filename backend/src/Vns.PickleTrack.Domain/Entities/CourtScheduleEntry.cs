using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class CourtScheduleEntry : Entity
{
    private CourtScheduleEntry()
    {
    }

    public CourtScheduleEntry(
        Guid courtId,
        string scheduleType,
        string ownerName,
        string purpose,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        string status)
    {
        CourtId = courtId;
        ScheduleType = scheduleType;
        OwnerName = ownerName;
        Purpose = purpose;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
        Status = status;
    }

    public Guid CourtId { get; private set; }

    public string ScheduleType { get; private set; } = string.Empty;

    public string OwnerName { get; private set; } = string.Empty;

    public string Purpose { get; private set; } = string.Empty;

    public DateTimeOffset StartsAtUtc { get; private set; }

    public DateTimeOffset EndsAtUtc { get; private set; }

    public string Status { get; private set; } = string.Empty;
}
