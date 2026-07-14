using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class PosSale : Entity
{
    private PosSale() { }

    public PosSale(
        string code,
        Guid? bookingId,
        decimal totalAmount,
        decimal costAmount,
        string itemsJson,
        string paymentMethod,
        string paymentStatus,
        string idempotencyKey)
    {
        Code = code;
        BookingId = bookingId;
        TotalAmount = totalAmount;
        CostAmount = costAmount;
        ItemsJson = itemsJson;
        PaymentMethod = paymentMethod;
        PaymentStatus = paymentStatus;
        IdempotencyKey = idempotencyKey;
    }

    public string Code { get; private set; } = string.Empty;
    public Guid? BookingId { get; private set; }
    public decimal TotalAmount { get; private set; }
    public decimal CostAmount { get; private set; }
    public string ItemsJson { get; private set; } = "[]";
    public string PaymentMethod { get; private set; } = string.Empty;
    public string PaymentStatus { get; private set; } = string.Empty;
    public string IdempotencyKey { get; private set; } = string.Empty;
}
