using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class BookingPayment : Entity
{
    private BookingPayment() { }

    public BookingPayment(
        Guid bookingId,
        string receiptCode,
        decimal amount,
        string method,
        DateTimeOffset paidAtUtc,
        string createdBy,
        string transactionType = "payment",
        string? note = null)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        BookingId = bookingId;
        ReceiptCode = receiptCode;
        Amount = amount;
        Method = method;
        PaidAtUtc = paidAtUtc;
        CreatedBy = createdBy;
        TransactionType = transactionType;
        Note = note;
    }

    public Guid BookingId { get; private set; }
    public string ReceiptCode { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public string Method { get; private set; } = string.Empty;
    public DateTimeOffset PaidAtUtc { get; private set; }
    public string CreatedBy { get; private set; } = string.Empty;
    public string TransactionType { get; private set; } = "payment";
    public string? Note { get; private set; }
}
