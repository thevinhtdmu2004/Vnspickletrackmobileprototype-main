using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class FinanceDebt : Entity
{
    private FinanceDebt()
    {
    }

    public FinanceDebt(
        string direction,
        string counterparty,
        string description,
        decimal amount,
        decimal paidAmount,
        DateTimeOffset dueAtUtc,
        string? sourceType = null,
        Guid? sourceId = null,
        string counterpartyType = "other")
    {
        Direction = direction;
        Counterparty = counterparty;
        Description = description;
        Amount = amount;
        PaidAmount = paidAmount;
        DueAtUtc = dueAtUtc;
        SourceType = sourceType;
        SourceId = sourceId;
        CounterpartyType = counterpartyType;
    }

    public string Direction { get; private set; } = string.Empty;

    public string Counterparty { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public decimal Amount { get; private set; }

    public decimal PaidAmount { get; private set; }

    public DateTimeOffset DueAtUtc { get; private set; }

    public string? SourceType { get; private set; }

    public Guid? SourceId { get; private set; }

    public string CounterpartyType { get; private set; } = "other";

    public bool IsCancelled { get; private set; }

    public decimal OutstandingAmount => Math.Max(0, Amount - PaidAmount);

    public void RecordPayment(decimal amount)
    {
        if (amount <= 0 || amount > OutstandingAmount)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        PaidAmount += amount;
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

    public void SyncAmount(decimal amount)
    {
        if (amount < PaidAmount)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        Amount = amount;
        MarkUpdated();
    }

    public void CloseCancelledSource()
    {
        Amount = PaidAmount;
        IsCancelled = true;
        MarkUpdated();
    }

    public void UpdateDetails(
        string direction,
        string counterparty,
        string description,
        decimal amount,
        DateTimeOffset dueAtUtc,
        string counterpartyType)
    {
        if (direction is not ("receivable" or "payable") ||
            string.IsNullOrWhiteSpace(counterparty) ||
            string.IsNullOrWhiteSpace(description) ||
            amount < PaidAmount)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        Direction = direction;
        Counterparty = counterparty.Trim();
        Description = description.Trim();
        Amount = amount;
        DueAtUtc = dueAtUtc;
        CounterpartyType = counterpartyType;
        IsCancelled = false;
        MarkUpdated();
    }

    public void Cancel()
    {
        if (PaidAmount > 0)
        {
            throw new InvalidOperationException("Paid debt cannot be cancelled.");
        }

        IsCancelled = true;
        MarkUpdated();
    }
}
