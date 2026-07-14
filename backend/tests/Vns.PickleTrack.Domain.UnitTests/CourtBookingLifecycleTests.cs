using Vns.PickleTrack.Domain.Entities;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class CourtBookingLifecycleTests
{
    [Fact]
    public void Constructor_CreatesStableReferenceAndCustomerType()
    {
        var booking = CreateBooking("member");

        Assert.StartsWith("BK-", booking.BookingCode);
        Assert.Equal(11, booking.BookingCode.Length);
        Assert.Equal("member", booking.CustomerType);
    }

    [Fact]
    public void Refund_ReducesNetPaidAmount()
    {
        var booking = CreateBooking();
        booking.RecordPayment(200_000m, "transfer", "PT-001");

        booking.RecordRefund(50_000m);

        Assert.Equal(150_000m, booking.PaidAmount);
    }

    [Fact]
    public void Refund_RejectsAmountAboveCollectedAmount()
    {
        var booking = CreateBooking();
        booking.RecordPayment(100_000m, "cash", "PT-001");

        Assert.Throws<ArgumentOutOfRangeException>(() => booking.RecordRefund(100_001m));
    }

    [Fact]
    public void MembershipBenefit_FreeBookingStillRejectsZeroPayment()
    {
        var booking = CreateBooking("member");

        booking.ApplyMembershipCourtBenefit(
            Guid.NewGuid(),
            Guid.NewGuid(),
            booking.Amount,
            "Gói hội viên",
            DateTimeOffset.UtcNow.AddDays(30),
            1,
            "Miễn tiền sân theo gói hội viên.");

        Assert.Equal(0m, booking.Amount);
        Assert.Throws<ArgumentOutOfRangeException>(() => booking.RecordPayment(0m, "transfer", "PT-001"));
    }

    private static CourtBooking CreateBooking(string customerType = "guest") =>
        new(
            Guid.NewGuid(),
            "Khách thử nghiệm",
            "0900000000",
            DateTimeOffset.UtcNow.AddDays(1),
            DateTimeOffset.UtcNow.AddDays(1).AddHours(1),
            180_000m,
            "confirmed",
            customerType);
}
