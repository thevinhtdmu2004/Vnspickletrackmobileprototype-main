using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class PaymentAllocation : Entity
{
    private PaymentAllocation()
    {
    }

    public PaymentAllocation(
        Guid paymentId,
        Guid invoiceId,
        decimal amount,
        string? note = null)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        PaymentId = paymentId;
        InvoiceId = invoiceId;
        Amount = amount;
        Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
    }

    public Guid PaymentId { get; private set; }

    public Guid InvoiceId { get; private set; }

    public decimal Amount { get; private set; }

    public string? Note { get; private set; }
}
