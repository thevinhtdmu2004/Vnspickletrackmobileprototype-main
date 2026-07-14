using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class FinanceEntry : Entity
{
    private FinanceEntry()
    {
    }

    public FinanceEntry(
        string code,
        string type,
        string category,
        string counterparty,
        decimal amount,
        string method,
        DateTimeOffset occurredAtUtc,
        string? referenceCode,
        string? note,
        string reconciliationStatus = "pending",
        decimal? actualAmount = null,
        string branchName = "Cơ sở chính",
        string createdBy = "Hệ thống")
    {
        Code = code;
        Type = type;
        Category = category;
        Counterparty = counterparty;
        Amount = amount;
        Method = method;
        OccurredAtUtc = occurredAtUtc;
        ReferenceCode = referenceCode;
        Note = note;
        ReconciliationStatus = reconciliationStatus;
        ActualAmount = actualAmount;
        BranchName = branchName;
        CreatedBy = createdBy;
    }

    public string Code { get; private set; } = string.Empty;

    public string Type { get; private set; } = string.Empty;

    public string Category { get; private set; } = string.Empty;

    public string Counterparty { get; private set; } = string.Empty;

    public decimal Amount { get; private set; }

    public decimal? ActualAmount { get; private set; }

    public string Method { get; private set; } = string.Empty;

    public DateTimeOffset OccurredAtUtc { get; private set; }

    public string? ReferenceCode { get; private set; }

    public string? Note { get; private set; }

    public string ReconciliationStatus { get; private set; } = string.Empty;

    public string BranchName { get; private set; } = "Cơ sở chính";

    public string CreatedBy { get; private set; } = "Hệ thống";

    public string? ConfirmedBy { get; private set; }

    public DateTimeOffset? ConfirmedAtUtc { get; private set; }

    public void Reconcile(decimal actualAmount, string confirmedBy = "Hệ thống")
    {
        ActualAmount = actualAmount;
        ReconciliationStatus = actualAmount == Amount ? "reconciled" : "mismatch";
        ConfirmedBy = confirmedBy;
        ConfirmedAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }
}
