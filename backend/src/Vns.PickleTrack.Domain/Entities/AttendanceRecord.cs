using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;
using Vns.PickleTrack.Domain.Rules;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class AttendanceRecord : Entity
{
    private AttendanceRecord()
    {
    }

    public AttendanceRecord(Guid sessionId, Guid memberId, AttendanceStatus status)
    {
        SessionId = sessionId;
        MemberId = memberId;
        SetStatus(status);
    }

    public Guid SessionId { get; private set; }

    public Guid MemberId { get; private set; }

    public AttendanceStatus Status { get; private set; }

    public bool DeductsSession { get; private set; }

    public string? Note { get; private set; }

    public void Correct(AttendanceStatus status, string? note)
    {
        SetStatus(status);
        Note = note;
        MarkUpdated();
    }

    private void SetStatus(AttendanceStatus status)
    {
        Status = status;
        DeductsSession = AttendanceRules.DeductsSession(status);
    }
}
