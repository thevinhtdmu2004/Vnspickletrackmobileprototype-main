using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class MembershipSubscription : Entity
{
    private MembershipSubscription()
    {
    }

    public MembershipSubscription(
        Guid memberId,
        Guid membershipPlanId,
        DateOnly startDate,
        DateOnly endDate,
        Guid? membershipRequestId = null)
    {
        if (endDate <= startDate)
        {
            throw new ArgumentException("Membership end date must be after start date.");
        }

        MemberId = memberId;
        MembershipPlanId = membershipPlanId;
        MembershipRequestId = membershipRequestId;
        StartDate = startDate;
        EndDate = endDate;
    }

    public Guid MemberId { get; private set; }

    public Guid MembershipPlanId { get; private set; }

    public Guid? MembershipRequestId { get; private set; }

    public DateOnly StartDate { get; private set; }

    public DateOnly EndDate { get; private set; }

    public MembershipSubscriptionStatus Status { get; private set; } = MembershipSubscriptionStatus.PendingActivation;

    public bool IsCurrent { get; private set; }

    public Guid? ActivatedByUserId { get; private set; }

    public DateTimeOffset? ActivatedAtUtc { get; private set; }

    public DateTimeOffset? CancelledAtUtc { get; private set; }

    public void Activate(Guid activatedByUserId)
    {
        Status = MembershipSubscriptionStatus.Active;
        IsCurrent = true;
        ActivatedByUserId = activatedByUserId;
        ActivatedAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }

    public void Cancel()
    {
        Status = MembershipSubscriptionStatus.Cancelled;
        IsCurrent = false;
        CancelledAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }

    public void Expire()
    {
        Status = MembershipSubscriptionStatus.Expired;
        IsCurrent = false;
        MarkUpdated();
    }
}
