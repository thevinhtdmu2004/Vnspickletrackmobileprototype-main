using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class CoachSettlement : Entity
{
    private CoachSettlement()
    {
    }

    public CoachSettlement(
        Guid coachId,
        string period,
        decimal usageHours,
        decimal grossRevenue,
        decimal courtFee,
        decimal paidAmount = 0m,
        string reconciliationStatus = "pending")
    {
        if (string.IsNullOrWhiteSpace(period))
        {
            throw new ArgumentException("Period is required.", nameof(period));
        }

        CoachId = coachId;
        Period = period;
        UsageHours = usageHours;
        GrossRevenue = grossRevenue;
        CourtFee = courtFee;
        PaidAmount = paidAmount;
        ReconciliationStatus = reconciliationStatus;
    }

    public Guid CoachId { get; private set; }

    public string Period { get; private set; } = string.Empty;

    public decimal UsageHours { get; private set; }

    public decimal GrossRevenue { get; private set; }

    public decimal CourtFee { get; private set; }

    public decimal PaidAmount { get; private set; }

    public string ReconciliationStatus { get; private set; } = string.Empty;

    public DateTimeOffset? ReconciledAtUtc { get; private set; }

    public bool IsConfirmed { get; private set; }

    public string? ConfirmedBy { get; private set; }

    public DateTimeOffset? ConfirmedAtUtc { get; private set; }

    public decimal OutstandingAmount => Math.Max(0, CourtFee - PaidAmount);

    public void Confirm(string confirmedBy)
    {
        if (string.IsNullOrWhiteSpace(confirmedBy))
        {
            throw new ArgumentException("Confirmed by is required.", nameof(confirmedBy));
        }

        IsConfirmed = true;
        ConfirmedBy = confirmedBy.Trim();
        ConfirmedAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }

    public void Reconcile(decimal paidAmount)
    {
        if (paidAmount < 0 || paidAmount > CourtFee)
        {
            throw new ArgumentOutOfRangeException(nameof(paidAmount));
        }

        PaidAmount = paidAmount;
        ReconciliationStatus = paidAmount >= CourtFee ? "reconciled" : paidAmount > 0 ? "partial" : "pending";
        ReconciledAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }
}
