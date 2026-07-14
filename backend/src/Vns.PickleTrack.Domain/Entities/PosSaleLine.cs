using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class PosSaleLine : Entity
{
    private PosSaleLine()
    {
    }

    public PosSaleLine(
        Guid posSaleId,
        Guid inventoryItemId,
        string itemNameSnapshot,
        int quantity,
        decimal unitPrice,
        decimal unitCost)
    {
        if (string.IsNullOrWhiteSpace(itemNameSnapshot) ||
            quantity <= 0 ||
            unitPrice < 0 ||
            unitCost < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity));
        }

        PosSaleId = posSaleId;
        InventoryItemId = inventoryItemId;
        ItemNameSnapshot = itemNameSnapshot.Trim();
        Quantity = quantity;
        UnitPrice = unitPrice;
        UnitCost = unitCost;
    }

    public Guid PosSaleId { get; private set; }

    public Guid InventoryItemId { get; private set; }

    public string ItemNameSnapshot { get; private set; } = string.Empty;

    public int Quantity { get; private set; }

    public decimal UnitPrice { get; private set; }

    public decimal UnitCost { get; private set; }

    public decimal LineAmount => Quantity * UnitPrice;

    public decimal CostAmount => Quantity * UnitCost;
}
