using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class AdminLifecycleTests
{
    [Fact]
    public void FinanceDebt_Cancel_RejectsDebtWithPayment()
    {
        var debt = new FinanceDebt(
            "receivable", "Khách", "Booking", 500_000m, 100_000m,
            DateTimeOffset.UtcNow.AddDays(1));

        Assert.Throws<InvalidOperationException>(() => debt.Cancel());
    }

    [Fact]
    public void FinanceDebt_UpdateDetails_PreservesPaidFloor()
    {
        var debt = new FinanceDebt(
            "receivable", "Khách", "Booking", 500_000m, 100_000m,
            DateTimeOffset.UtcNow.AddDays(1));

        Assert.Throws<ArgumentOutOfRangeException>(() => debt.UpdateDetails(
            "receivable", "Khách", "Booking", 50_000m,
            DateTimeOffset.UtcNow.AddDays(2), "booking"));
    }

    [Fact]
    public void Package_CanBeUpdatedAndDeactivated()
    {
        var package = new Package("Gói 8 buổi", 8, 1_600_000m);

        package.Update("Gói 12 buổi", 12, 2_200_000m);
        package.SetActive(false);

        Assert.Equal("Gói 12 buổi", package.Name);
        Assert.Equal(12, package.SessionCount);
        Assert.False(package.IsActive);
    }

    [Fact]
    public void User_CanChangeRoleAndAccountStatus()
    {
        var user = new User("member", "Hội viên", "hash", UserRole.Member);

        user.ChangeRole(UserRole.Coach);
        user.SetActive(false);

        Assert.Equal(UserRole.Coach, user.Role);
        Assert.False(user.IsActive);
    }

    [Fact]
    public void PaymentRenewal_FreeCourtBenefit_RequiresValidityAndRemainingUse()
    {
        var startsAt = DateTimeOffset.UtcNow.AddDays(1);
        var renewal = new PaymentRenewal(
            Guid.NewGuid(),
            Guid.NewGuid(),
            12,
            2_400_000m,
            activatedAtUtc: startsAt.AddDays(-1),
            expiresAtUtc: startsAt.AddDays(5),
            freeCourtUsesGranted: 1);

        Assert.True(renewal.TryUseFreeCourt(startsAt));
        Assert.Equal(0, renewal.FreeCourtUsesRemaining);
        Assert.False(renewal.TryUseFreeCourt(startsAt.AddHours(1)));
        Assert.False(renewal.CanUseFreeCourt(startsAt.AddDays(6)));
    }

    [Fact]
    public void CourtBooking_MembershipBenefit_KeepsGrossAndChargedCourtAmounts()
    {
        var booking = new CourtBooking(
            Guid.NewGuid(),
            "Hội viên",
            "0900000000",
            DateTimeOffset.UtcNow.AddDays(1),
            DateTimeOffset.UtcNow.AddDays(1).AddHours(1),
            180_000m,
            "confirmed",
            "member");

        booking.ApplyMembershipCourtBenefit(
            Guid.NewGuid(),
            Guid.NewGuid(),
            180_000m,
            "Premium",
            DateTimeOffset.UtcNow.AddDays(20),
            1,
            "Miễn tiền sân theo gói Premium.");

        Assert.Equal(180_000m, booking.CourtAmountBeforeBenefit);
        Assert.Equal(180_000m, booking.CourtBenefitDiscount);
        Assert.Equal(0m, booking.Amount);
        Assert.Equal("Premium", booking.MembershipPackageName);
    }

    [Fact]
    public void Court_StatusControlsBookableState()
    {
        var court = new Court("Sân test", "Acrylic", 180_000m);

        Assert.True(court.IsBookable);

        court.SetOperationalStatus("maintenance");
        Assert.True(court.IsActive);
        Assert.False(court.IsBookable);

        court.SetOperationalStatus("inactive");
        Assert.False(court.IsActive);
        Assert.False(court.IsBookable);
    }

    [Fact]
    public void Court_UpdateDetails_RequiresValidOperatingHours()
    {
        var court = new Court("Sân test", "Acrylic", 180_000m);

        Assert.Throws<ArgumentException>(() => court.UpdateDetails(
            "Sân test",
            "standard",
            "Acrylic",
            string.Empty,
            4,
            new TimeOnly(22, 0),
            new TimeOnly(6, 0),
            180_000m));
    }
}
