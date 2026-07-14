using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class InventoryMovement : Entity
{
    private InventoryMovement() { }

    public InventoryMovement(
        Guid inventoryItemId,
        string movementType,
        int quantityChange,
        decimal unitCost,
        string referenceCode,
        string createdBy)
    {
        InventoryItemId = inventoryItemId;
        MovementType = movementType;
        QuantityChange = quantityChange;
        UnitCost = unitCost;
        ReferenceCode = referenceCode;
        CreatedBy = createdBy;
    }

    public Guid InventoryItemId { get; private set; }
    public string MovementType { get; private set; } = string.Empty;
    public int QuantityChange { get; private set; }
    public decimal UnitCost { get; private set; }
    public string ReferenceCode { get; private set; } = string.Empty;
    public string CreatedBy { get; private set; } = string.Empty;
    public decimal TotalCost => Math.Abs(QuantityChange) * UnitCost;
}
