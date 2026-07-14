using Vns.PickleTrack.Domain.Entities;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class FinanceEntryTests
{
    [Fact]
    public void Reconcile_MarksEntryAsReconciled_WhenAmountsMatch()
    {
        var entry = CreateEntry();

        entry.Reconcile(450_000m, "Chủ sân VNS");

        Assert.Equal(450_000m, entry.ActualAmount);
        Assert.Equal("reconciled", entry.ReconciliationStatus);
        Assert.Equal("Chủ sân VNS", entry.ConfirmedBy);
        Assert.NotNull(entry.ConfirmedAtUtc);
    }

    [Fact]
    public void Reconcile_MarksEntryAsMismatch_WhenAmountsDiffer()
    {
        var entry = CreateEntry();

        entry.Reconcile(400_000m);

        Assert.Equal(400_000m, entry.ActualAmount);
        Assert.Equal("mismatch", entry.ReconciliationStatus);
    }

    private static FinanceEntry CreateEntry()
    {
        return new FinanceEntry(
            "PT-TEST-001",
            "income",
            "courtRental",
            "Nguyễn Lan",
            450_000m,
            "transfer",
            DateTimeOffset.UtcNow,
            "BK-TEST-001",
            "Thuê sân A1");
    }
}
