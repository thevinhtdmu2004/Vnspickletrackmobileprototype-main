using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class ClassSession : Entity
{
    private ClassSession()
    {
    }

    public ClassSession(Guid classId, DateTimeOffset startsAtUtc, DateTimeOffset endsAtUtc)
    {
        ClassId = classId;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
    }

    public Guid ClassId { get; private set; }

    public DateTimeOffset StartsAtUtc { get; private set; }

    public DateTimeOffset EndsAtUtc { get; private set; }

    public bool IsCompleted { get; private set; }

    public bool IsCancelled { get; private set; }
}
