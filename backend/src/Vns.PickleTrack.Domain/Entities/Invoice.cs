using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Invoice : Entity
{
    private Invoice()
    {
    }

    public Invoice(
        string invoiceCode,
        string invoiceType,
        string customerType,
        string customerName,
        decimal grossAmount,
        decimal discountAmount,
        Guid? memberId = null,
        string? sourceType = null,
        Guid? sourceId = null,
        DateTimeOffset? issuedAtUtc = null)
    {
        if (string.IsNullOrWhiteSpace(invoiceCode) ||
            string.IsNullOrWhiteSpace(invoiceType) ||
            string.IsNullOrWhiteSpace(customerType) ||
            string.IsNullOrWhiteSpace(customerName) ||
            grossAmount < 0 ||
            discountAmount < 0 ||
            discountAmount > grossAmount)
        {
            throw new ArgumentOutOfRangeException(nameof(grossAmount));
        }

        InvoiceCode = invoiceCode.Trim();
        InvoiceType = invoiceType.Trim();
        CustomerType = customerType.Trim();
        CustomerName = customerName.Trim();
        GrossAmount = grossAmount;
        DiscountAmount = discountAmount;
        MemberId = memberId;
        SourceType = Normalize(sourceType);
        SourceId = sourceId;
        IssuedAtUtc = issuedAtUtc ?? DateTimeOffset.UtcNow;
        Status = InvoiceStatus.Issued;
    }

    public string InvoiceCode { get; private set; } = string.Empty;

    public string InvoiceType { get; private set; } = string.Empty;

    public string CustomerType { get; private set; } = string.Empty;

    public string CustomerName { get; private set; } = string.Empty;

    public Guid? MemberId { get; private set; }

    public string? SourceType { get; private set; }

    public Guid? SourceId { get; private set; }

    public DateTimeOffset IssuedAtUtc { get; private set; }

    public decimal GrossAmount { get; private set; }

    public decimal DiscountAmount { get; private set; }

    public decimal PaidAmount { get; private set; }

    public decimal NetAmount => Math.Max(0, GrossAmount - DiscountAmount);

    public decimal OutstandingAmount => Math.Max(0, NetAmount - PaidAmount);

    public InvoiceStatus Status { get; private set; }

    public string? Note { get; private set; }

    public void ApplyPayment(decimal amount)
    {
        if (amount <= 0 || PaidAmount + amount > NetAmount)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        PaidAmount += amount;
        Status = PaidAmount >= NetAmount ? InvoiceStatus.Paid : InvoiceStatus.PartiallyPaid;
        MarkUpdated();
    }

    public void Cancel(string? note = null)
    {
        Status = InvoiceStatus.Cancelled;
        Note = Normalize(note);
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
