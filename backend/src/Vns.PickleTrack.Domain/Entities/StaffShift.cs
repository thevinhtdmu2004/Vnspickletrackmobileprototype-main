using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class StaffShift : Entity
{
    private StaffShift() { }

    public StaffShift(string staffName, DateTimeOffset startsAtUtc, DateTimeOffset endsAtUtc, string status)
    {
        StaffName = staffName;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
        Status = status;
    }

    public string StaffName { get; private set; } = string.Empty;
    public DateTimeOffset StartsAtUtc { get; private set; }
    public DateTimeOffset EndsAtUtc { get; private set; }
    public string Status { get; private set; } = string.Empty;

    public void MarkHandedOver()
    {
        Status = "handedOver";
        MarkUpdated();
    }
}
