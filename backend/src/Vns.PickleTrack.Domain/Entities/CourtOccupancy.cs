using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class CourtOccupancy : Entity
{
    private CourtOccupancy()
    {
    }

    public CourtOccupancy(
        Guid courtId,
        CourtOccupancySourceType sourceType,
        Guid sourceId,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        string title,
        string ownerName,
        CourtOccupancyStatus status = CourtOccupancyStatus.Confirmed)
    {
        if (endsAtUtc <= startsAtUtc ||
            string.IsNullOrWhiteSpace(title) ||
            string.IsNullOrWhiteSpace(ownerName))
        {
            throw new ArgumentException("Invalid court occupancy.");
        }

        CourtId = courtId;
        SourceType = sourceType;
        SourceId = sourceId;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
        Title = title.Trim();
        OwnerName = ownerName.Trim();
        Status = status;
    }

    public Guid CourtId { get; private set; }

    public CourtOccupancySourceType SourceType { get; private set; }

    public Guid SourceId { get; private set; }

    public DateTimeOffset StartsAtUtc { get; private set; }

    public DateTimeOffset EndsAtUtc { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string OwnerName { get; private set; } = string.Empty;

    public CourtOccupancyStatus Status { get; private set; }

    public bool BlocksCourt =>
        Status is CourtOccupancyStatus.Pending
            or CourtOccupancyStatus.Confirmed
            or CourtOccupancyStatus.InUse
            or CourtOccupancyStatus.Blocked;

    public void Reschedule(Guid courtId, DateTimeOffset startsAtUtc, DateTimeOffset endsAtUtc)
    {
        if (endsAtUtc <= startsAtUtc)
        {
            throw new ArgumentException("End time must be after start time.");
        }

        CourtId = courtId;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
        MarkUpdated();
    }

    public void ChangeStatus(CourtOccupancyStatus status)
    {
        Status = status;
        MarkUpdated();
    }
}
