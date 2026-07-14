using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class EquipmentRentalOrderItem : Entity
{
    private EquipmentRentalOrderItem()
    {
    }

    public EquipmentRentalOrderItem(
        Guid equipmentRentalOrderId,
        Guid inventoryItemId,
        int requestedQuantity,
        decimal surchargeAmount = 0m,
        string? note = null)
    {
        if (requestedQuantity <= 0 || surchargeAmount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(requestedQuantity));
        }

        EquipmentRentalOrderId = equipmentRentalOrderId;
        InventoryItemId = inventoryItemId;
        RequestedQuantity = requestedQuantity;
        SurchargeAmount = surchargeAmount;
        Note = Normalize(note);
    }

    public Guid EquipmentRentalOrderId { get; private set; }

    public Guid InventoryItemId { get; private set; }

    public int RequestedQuantity { get; private set; }

    public int ReceivedQuantity { get; private set; }

    public int ReturnedQuantity { get; private set; }

    public int LostQuantity { get; private set; }

    public EquipmentRentalStatus Status { get; private set; } = EquipmentRentalStatus.Requested;

    public decimal SurchargeAmount { get; private set; }

    public string? Note { get; private set; }

    public void MarkReceived(int quantity)
    {
        if (quantity <= 0 || quantity > RequestedQuantity)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity));
        }

        ReceivedQuantity = quantity;
        Status = EquipmentRentalStatus.Received;
        MarkUpdated();
    }

    public void MarkReturned(int returnedQuantity, int lostQuantity = 0)
    {
        if (returnedQuantity < 0 || lostQuantity < 0 || returnedQuantity + lostQuantity > ReceivedQuantity)
        {
            throw new ArgumentOutOfRangeException(nameof(returnedQuantity));
        }

        ReturnedQuantity = returnedQuantity;
        LostQuantity = lostQuantity;
        Status = lostQuantity > 0 ? EquipmentRentalStatus.LostClosed : EquipmentRentalStatus.Returned;
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
