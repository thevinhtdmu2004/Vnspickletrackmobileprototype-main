using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class PaymentRenewal : Entity
{
    private PaymentRenewal()
    {
    }

    public PaymentRenewal(
        Guid memberId,
        Guid packageId,
        int sessionsAdded,
        decimal amount,
        string paymentMethod = "transfer",
        string paymentStatus = "paid",
        string? note = null,
        DateTimeOffset? activatedAtUtc = null,
        DateTimeOffset? expiresAtUtc = null,
        int freeCourtUsesGranted = 0)
    {
        MemberId = memberId;
        PackageId = packageId;
        SessionsAdded = sessionsAdded;
        Amount = amount;
        PaymentMethod = paymentMethod;
        PaymentStatus = paymentStatus;
        Note = note;
        ActivatedAtUtc = activatedAtUtc ?? DateTimeOffset.UtcNow;
        ExpiresAtUtc = expiresAtUtc ?? ActivatedAtUtc.AddDays(30);
        FreeCourtUsesGranted = freeCourtUsesGranted;
    }

    public Guid MemberId { get; private set; }

    public Guid PackageId { get; private set; }

    public int SessionsAdded { get; private set; }

    public decimal Amount { get; private set; }

    public string PaymentMethod { get; private set; } = string.Empty;

    public string PaymentStatus { get; private set; } = string.Empty;

    public string? Note { get; private set; }

    public DateTimeOffset ActivatedAtUtc { get; private set; }

    public DateTimeOffset ExpiresAtUtc { get; private set; }

    public int FreeCourtUsesGranted { get; private set; }

    public int FreeCourtUsesUsed { get; private set; }

    public int FreeCourtUsesRemaining => Math.Max(0, FreeCourtUsesGranted - FreeCourtUsesUsed);

    public bool CanUseFreeCourt(DateTimeOffset startsAtUtc) =>
        PaymentStatus == "paid" &&
        ActivatedAtUtc <= startsAtUtc &&
        ExpiresAtUtc >= startsAtUtc &&
        FreeCourtUsesRemaining > 0;

    public bool TryUseFreeCourt(DateTimeOffset startsAtUtc)
    {
        if (!CanUseFreeCourt(startsAtUtc))
        {
            return false;
        }

        FreeCourtUsesUsed++;
        MarkUpdated();
        return true;
    }

    public void ConfigureCourtBenefit(
        DateTimeOffset activatedAtUtc,
        DateTimeOffset expiresAtUtc,
        int freeCourtUsesGranted)
    {
        if (expiresAtUtc <= activatedAtUtc ||
            freeCourtUsesGranted < FreeCourtUsesUsed)
        {
            throw new ArgumentOutOfRangeException(nameof(freeCourtUsesGranted));
        }

        ActivatedAtUtc = activatedAtUtc;
        ExpiresAtUtc = expiresAtUtc;
        FreeCourtUsesGranted = freeCourtUsesGranted;
        MarkUpdated();
    }
}
