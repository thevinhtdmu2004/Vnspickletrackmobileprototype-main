using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class BookingConflictResolution : Entity
{
    private BookingConflictResolution()
    {
    }

    public BookingConflictResolution(
        Guid bookingId,
        string action,
        string note,
        string resolvedBy)
    {
        BookingId = bookingId;
        Action = action;
        Note = note;
        ResolvedBy = resolvedBy;
        ResolvedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid BookingId { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public string Note { get; private set; } = string.Empty;
    public string ResolvedBy { get; private set; } = string.Empty;
    public DateTimeOffset ResolvedAtUtc { get; private set; }
}
