using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class InventoryItem : Entity
{
    private InventoryItem() { }

    public InventoryItem(
        string sku,
        string name,
        string category,
        decimal salePrice,
        decimal costPrice,
        int quantity,
        int reorderLevel,
        int rentalTotal = 0,
        int rentalInUse = 0)
    {
        Sku = sku;
        Name = name;
        Category = category;
        SalePrice = salePrice;
        CostPrice = costPrice;
        Quantity = quantity;
        ReorderLevel = reorderLevel;
        RentalTotal = rentalTotal;
        RentalInUse = rentalInUse;
    }

    public string Sku { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public decimal SalePrice { get; private set; }
    public decimal CostPrice { get; private set; }
    public int Quantity { get; private set; }
    public int ReorderLevel { get; private set; }
    public int RentalTotal { get; private set; }
    public int RentalInUse { get; private set; }

    public bool TryRemoveStock(int quantity)
    {
        if (quantity <= 0 || quantity > Quantity) return false;
        Quantity -= quantity;
        MarkUpdated();
        return true;
    }

    public bool TryCheckoutRental(int quantity)
    {
        if (Category != "rental" ||
            quantity <= 0 ||
            quantity > Quantity ||
            RentalInUse + quantity > RentalTotal)
        {
            return false;
        }

        Quantity -= quantity;
        RentalInUse += quantity;
        MarkUpdated();
        return true;
    }

    public void AddStock(int quantity, decimal? unitCost = null)
    {
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        if (unitCost.HasValue)
        {
            if (unitCost.Value < 0) throw new ArgumentOutOfRangeException(nameof(unitCost));
            var currentValue = Quantity * CostPrice;
            CostPrice = (currentValue + quantity * unitCost.Value) / (Quantity + quantity);
        }
        Quantity += quantity;
        MarkUpdated();
    }

    public void SetQuantity(int quantity)
    {
        if (quantity < 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        Quantity = quantity;
        MarkUpdated();
    }
}
