using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class MembershipRequest : Entity
{
    private MembershipRequest()
    {
    }

    public MembershipRequest(
        Guid memberId,
        Guid membershipPlanId,
        MembershipRequestType requestType,
        DateOnly requestedStartDate,
        string? note = null)
    {
        MemberId = memberId;
        MembershipPlanId = membershipPlanId;
        RequestType = requestType;
        RequestedStartDate = requestedStartDate;
        Note = Normalize(note);
    }

    public Guid MemberId { get; private set; }

    public Guid MembershipPlanId { get; private set; }

    public MembershipRequestType RequestType { get; private set; }

    public DateOnly RequestedStartDate { get; private set; }

    public RenewalRequestStatus Status { get; private set; } = RenewalRequestStatus.Pending;

    public string? Note { get; private set; }

    public Guid? ReviewedByUserId { get; private set; }

    public DateTimeOffset? ReviewedAtUtc { get; private set; }

    public string? ReviewNote { get; private set; }

    public void Review(RenewalRequestStatus status, Guid reviewedByUserId, string? reviewNote)
    {
        if (status is RenewalRequestStatus.Pending)
        {
            throw new ArgumentOutOfRangeException(nameof(status));
        }

        Status = status;
        ReviewedByUserId = reviewedByUserId;
        ReviewedAtUtc = DateTimeOffset.UtcNow;
        ReviewNote = Normalize(reviewNote);
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
