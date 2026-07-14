using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Payment : Entity
{
    private Payment()
    {
    }

    public Payment(
        string paymentCode,
        decimal amount,
        PaymentMethod method,
        DateTimeOffset paidAtUtc,
        Guid createdByUserId,
        string? externalReference = null,
        string? note = null)
    {
        if (string.IsNullOrWhiteSpace(paymentCode) || amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        PaymentCode = paymentCode.Trim();
        Amount = amount;
        Method = method;
        PaidAtUtc = paidAtUtc;
        CreatedByUserId = createdByUserId;
        ExternalReference = Normalize(externalReference);
        Note = Normalize(note);
    }

    public string PaymentCode { get; private set; } = string.Empty;

    public decimal Amount { get; private set; }

    public PaymentMethod Method { get; private set; }

    public PaymentStatus Status { get; private set; } = PaymentStatus.Posted;

    public DateTimeOffset PaidAtUtc { get; private set; }

    public Guid CreatedByUserId { get; private set; }

    public string? ExternalReference { get; private set; }

    public string? Note { get; private set; }

    public void Reverse(string? note = null)
    {
        Status = PaymentStatus.Reversed;
        Note = Normalize(note);
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
