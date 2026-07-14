using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class InvoiceLine : Entity
{
    private InvoiceLine()
    {
    }

    public InvoiceLine(
        Guid invoiceId,
        string lineType,
        string description,
        int quantity,
        decimal unitAmount,
        Guid? sourceId = null,
        string? sourceType = null,
        Guid? inventoryItemId = null)
    {
        if (string.IsNullOrWhiteSpace(lineType) ||
            string.IsNullOrWhiteSpace(description) ||
            quantity <= 0 ||
            unitAmount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity));
        }

        InvoiceId = invoiceId;
        LineType = lineType.Trim();
        Description = description.Trim();
        Quantity = quantity;
        UnitAmount = unitAmount;
        SourceId = sourceId;
        SourceType = Normalize(sourceType);
        InventoryItemId = inventoryItemId;
    }

    public Guid InvoiceId { get; private set; }

    public string LineType { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public int Quantity { get; private set; }

    public decimal UnitAmount { get; private set; }

    public decimal TotalAmount => Quantity * UnitAmount;

    public string? SourceType { get; private set; }

    public Guid? SourceId { get; private set; }

    public Guid? InventoryItemId { get; private set; }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
