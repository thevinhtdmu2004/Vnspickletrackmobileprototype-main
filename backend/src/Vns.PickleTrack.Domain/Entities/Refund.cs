using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Refund : Entity
{
    private Refund()
    {
    }

    public Refund(
        string refundCode,
        Guid invoiceId,
        decimal amount,
        string reason,
        Guid createdByUserId,
        DateTimeOffset refundedAtUtc)
    {
        if (string.IsNullOrWhiteSpace(refundCode) ||
            string.IsNullOrWhiteSpace(reason) ||
            amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        RefundCode = refundCode.Trim();
        InvoiceId = invoiceId;
        Amount = amount;
        Reason = reason.Trim();
        CreatedByUserId = createdByUserId;
        RefundedAtUtc = refundedAtUtc;
    }

    public string RefundCode { get; private set; } = string.Empty;

    public Guid InvoiceId { get; private set; }

    public decimal Amount { get; private set; }

    public string Reason { get; private set; } = string.Empty;

    public Guid CreatedByUserId { get; private set; }

    public DateTimeOffset RefundedAtUtc { get; private set; }
}
