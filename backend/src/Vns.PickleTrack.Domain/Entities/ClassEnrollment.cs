using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class ClassEnrollment : Entity
{
    private ClassEnrollment()
    {
    }

    public ClassEnrollment(
        Guid classId,
        Guid memberId,
        Guid? packageId = null,
        DateTimeOffset? enrolledAtUtc = null)
    {
        ClassId = classId;
        MemberId = memberId;
        PackageId = packageId;
        EnrolledAtUtc = enrolledAtUtc ?? DateTimeOffset.UtcNow;
    }

    public Guid ClassId { get; private set; }

    public Guid MemberId { get; private set; }

    public Guid? PackageId { get; private set; }

    public ClassEnrollmentStatus Status { get; private set; } = ClassEnrollmentStatus.Active;

    public DateTimeOffset EnrolledAtUtc { get; private set; }

    public DateTimeOffset? LeftAtUtc { get; private set; }

    public string? Note { get; private set; }

    public void Complete(string? note = null)
    {
        Status = ClassEnrollmentStatus.Completed;
        LeftAtUtc = DateTimeOffset.UtcNow;
        Note = Normalize(note);
        MarkUpdated();
    }

    public void Withdraw(string? note = null)
    {
        Status = ClassEnrollmentStatus.Withdrawn;
        LeftAtUtc = DateTimeOffset.UtcNow;
        Note = Normalize(note);
        MarkUpdated();
    }

    public void Suspend(string? note = null)
    {
        Status = ClassEnrollmentStatus.Suspended;
        Note = Normalize(note);
        MarkUpdated();
    }

    public void Reactivate()
    {
        Status = ClassEnrollmentStatus.Active;
        LeftAtUtc = null;
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
