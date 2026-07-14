using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class PackageLedgerEntry : Entity
{
    private PackageLedgerEntry()
    {
    }

    public PackageLedgerEntry(
        Guid memberId,
        PackageLedgerSourceType sourceType,
        Guid sourceId,
        int sessionDelta,
        DateTimeOffset occurredAtUtc,
        Guid? classEnrollmentId = null,
        int? balanceAfter = null,
        string? note = null)
    {
        if (sessionDelta == 0)
        {
            throw new ArgumentOutOfRangeException(nameof(sessionDelta));
        }

        MemberId = memberId;
        ClassEnrollmentId = classEnrollmentId;
        SourceType = sourceType;
        SourceId = sourceId;
        SessionDelta = sessionDelta;
        OccurredAtUtc = occurredAtUtc;
        BalanceAfter = balanceAfter;
        Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
    }

    public Guid MemberId { get; private set; }

    public Guid? ClassEnrollmentId { get; private set; }

    public PackageLedgerSourceType SourceType { get; private set; }

    public Guid SourceId { get; private set; }

    public int SessionDelta { get; private set; }

    public int? BalanceAfter { get; private set; }

    public DateTimeOffset OccurredAtUtc { get; private set; }

    public string? Note { get; private set; }
}
