using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class RenewalRequest : Entity
{
    private RenewalRequest()
    {
    }

    public RenewalRequest(Guid memberId, Guid packageId, string? note)
    {
        MemberId = memberId;
        PackageId = packageId;
        Note = note;
    }

    public Guid MemberId { get; private set; }

    public Guid PackageId { get; private set; }

    public RenewalRequestStatus Status { get; private set; } = RenewalRequestStatus.Pending;

    public string? Note { get; private set; }
}
