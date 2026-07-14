using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class BookingCharge : Entity
{
    private BookingCharge()
    {
    }

    public BookingCharge(
        Guid bookingId,
        string chargeType,
        string description,
        int quantity,
        decimal unitAmount)
    {
        if (quantity <= 0 || unitAmount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity));
        }

        BookingId = bookingId;
        ChargeType = chargeType;
        Description = description.Trim();
        Quantity = quantity;
        UnitAmount = unitAmount;
    }

    public Guid BookingId { get; private set; }

    public string ChargeType { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public int Quantity { get; private set; }

    public decimal UnitAmount { get; private set; }

    public decimal TotalAmount => Quantity * UnitAmount;
}
