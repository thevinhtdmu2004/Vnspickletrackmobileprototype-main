using Vns.PickleTrack.Domain.Entities;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class InventoryItemTests
{
    [Fact]
    public void TryRemoveStock_DeductsQuantity_WhenStockIsAvailable()
    {
        var item = CreateItem(10);

        var result = item.TryRemoveStock(4);

        Assert.True(result);
        Assert.Equal(6, item.Quantity);
    }

    [Fact]
    public void TryRemoveStock_DoesNotChangeQuantity_WhenRequestedQuantityExceedsStock()
    {
        var item = CreateItem(3);

        var result = item.TryRemoveStock(4);

        Assert.False(result);
        Assert.Equal(3, item.Quantity);
    }

    [Fact]
    public void AddStock_IncreasesQuantity()
    {
        var item = CreateItem(3);

        item.AddStock(10);

        Assert.Equal(13, item.Quantity);
    }

    [Fact]
    public void AddStock_RecalculatesWeightedAverageCost()
    {
        var item = CreateItem(10);

        item.AddStock(10, 12_000m);

        Assert.Equal(20, item.Quantity);
        Assert.Equal(10_000m, item.CostPrice);
    }

    [Fact]
    public void SetQuantity_UsesCountedQuantity()
    {
        var item = CreateItem(10);

        item.SetQuantity(7);

        Assert.Equal(7, item.Quantity);
    }

    [Fact]
    public void TryCheckoutRental_UpdatesAvailableAndInUseQuantities()
    {
        var item = new InventoryItem(
            "RENT-001",
            "Vợt cho thuê",
            "rental",
            40_000m,
            850_000m,
            6,
            1,
            8,
            2);

        var result = item.TryCheckoutRental(1);

        Assert.True(result);
        Assert.Equal(5, item.Quantity);
        Assert.Equal(3, item.RentalInUse);
    }

    private static InventoryItem CreateItem(int quantity)
    {
        return new InventoryItem(
            "TEST-001",
            "Nước suối",
            "retail",
            15_000m,
            8_000m,
            quantity,
            5);
    }
}
