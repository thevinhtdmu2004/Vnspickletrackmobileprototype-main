using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class CourtBooking : Entity
{
    private CourtBooking()
    {
    }

    public CourtBooking(
        Guid courtId,
        string customerName,
        string customerPhone,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        decimal amount,
        string status,
        string customerType = "guest")
    {
        CourtId = courtId;
        BookingCode = $"BK-{Id.ToString("N")[..8].ToUpperInvariant()}";
        CustomerName = customerName;
        CustomerPhone = customerPhone;
        CustomerType = customerType;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
        Amount = amount;
        CourtAmountBeforeBenefit = amount;
        Status = status;
    }

    public string BookingCode { get; private set; } = string.Empty;

    public Guid CourtId { get; private set; }

    public string CustomerName { get; private set; } = string.Empty;

    public string CustomerPhone { get; private set; } = string.Empty;

    public string CustomerType { get; private set; } = "guest";

    public DateTimeOffset StartsAtUtc { get; private set; }

    public DateTimeOffset EndsAtUtc { get; private set; }

    public decimal Amount { get; private set; }

    public decimal CourtAmountBeforeBenefit { get; private set; }

    public decimal CourtBenefitDiscount { get; private set; }

    public Guid? MemberId { get; private set; }

    public Guid? AppliedMembershipRenewalId { get; private set; }

    public string? MembershipBenefitNote { get; private set; }

    public string? MembershipPackageName { get; private set; }

    public DateTimeOffset? MembershipBenefitExpiresAtUtc { get; private set; }

    public int? MembershipBenefitUsesRemainingAfterApply { get; private set; }

    public string Status { get; private set; } = string.Empty;

    public decimal PaidAmount { get; private set; }

    public string? PaymentMethod { get; private set; }

    public string? ReceiptCode { get; private set; }

    public void ApplyMembershipCourtBenefit(
        Guid memberId,
        Guid paymentRenewalId,
        decimal courtAmountBeforeBenefit,
        string packageName,
        DateTimeOffset benefitExpiresAtUtc,
        int usesRemainingAfterApply,
        string benefitNote)
    {
        if (courtAmountBeforeBenefit < 0 || string.IsNullOrWhiteSpace(benefitNote))
        {
            throw new ArgumentOutOfRangeException(nameof(courtAmountBeforeBenefit));
        }

        MemberId = memberId;
        AppliedMembershipRenewalId = paymentRenewalId;
        CourtAmountBeforeBenefit = courtAmountBeforeBenefit;
        CourtBenefitDiscount = courtAmountBeforeBenefit;
        MembershipPackageName = packageName.Trim();
        MembershipBenefitExpiresAtUtc = benefitExpiresAtUtc;
        MembershipBenefitUsesRemainingAfterApply = usesRemainingAfterApply;
        MembershipBenefitNote = benefitNote.Trim();
        Amount = 0;
        MarkUpdated();
    }

    public void Reschedule(
        Guid courtId,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        decimal amount)
    {
        CourtId = courtId;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
        Amount = amount;
        MarkUpdated();
    }

    public void Cancel()
    {
        Status = "cancelled";
        MarkUpdated();
    }

    public void RecordPayment(decimal amount, string method, string receiptCode)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        PaidAmount += amount;
        PaymentMethod = method;
        ReceiptCode = receiptCode;
        MarkUpdated();
    }

    public void RecordRefund(decimal amount)
    {
        if (amount <= 0 || amount > PaidAmount)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        PaidAmount -= amount;
        MarkUpdated();
    }
}
