using Vns.PickleTrack.Domain.Entities;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class CoachOperationsTests
{
    [Fact]
    public void UpdateAgreement_UpdatesPartnershipModel()
    {
        var coach = new Coach(Guid.NewGuid(), "HLV Minh");

        coach.UpdateAgreement("underReview", "hybrid", 120_000m, 20m);

        Assert.Equal("underReview", coach.PartnershipStatus);
        Assert.Equal("hybrid", coach.AgreementType);
        Assert.False(coach.IsActive);
    }

    [Fact]
    public void Reconcile_TracksPartialPayment()
    {
        var settlement = new CoachSettlement(
            Guid.NewGuid(),
            "2026-06",
            10m,
            8_000_000m,
            1_500_000m);

        settlement.Reconcile(500_000m);

        Assert.Equal("partial", settlement.ReconciliationStatus);
        Assert.Equal(1_000_000m, settlement.OutstandingAmount);
        Assert.NotNull(settlement.ReconciledAtUtc);
    }

    [Fact]
    public void Confirm_StoresAuditInformationWithoutRecordingPayment()
    {
        var settlement = new CoachSettlement(
            Guid.NewGuid(),
            "2026-06",
            10m,
            8_000_000m,
            1_500_000m);

        settlement.Confirm("Admin sân");

        Assert.True(settlement.IsConfirmed);
        Assert.Equal("Admin sân", settlement.ConfirmedBy);
        Assert.NotNull(settlement.ConfirmedAtUtc);
        Assert.Equal(0m, settlement.PaidAmount);
    }

    [Fact]
    public void RecordPayment_AllowsPartialAndFullDebtPayment()
    {
        var debt = new FinanceDebt(
            "receivable",
            "HLV Minh",
            "Phí sân kỳ 2026-06",
            1_500_000m,
            0m,
            DateTimeOffset.UtcNow.AddDays(7));

        debt.RecordPayment(500_000m);
        debt.RecordPayment(1_000_000m);

        Assert.Equal(1_500_000m, debt.PaidAmount);
        Assert.Equal(0m, debt.OutstandingAmount);
    }

    [Fact]
    public void UpdateProfile_StoresPartnershipContactAndExpertise()
    {
        var coach = new Coach(Guid.NewGuid(), "HLV Minh");

        coach.UpdateProfile(
            null,
            "0909000001",
            "minh@example.com",
            "Chuyên nghiệp",
            "PPR",
            8,
            "Kỹ thuật, chiến thuật",
            "HLV đối tác",
            "Thứ 2 - Thứ 7");

        Assert.Equal("0909000001", coach.PhoneNumber);
        Assert.Equal(8, coach.ExperienceYears);
        Assert.Equal("Kỹ thuật, chiến thuật", coach.TeachingSkills);
    }

    [Fact]
    public void BookingReschedule_RepricesOnlyTheChangedBookingSnapshot()
    {
        var booking = new CourtBooking(
            Guid.NewGuid(),
            "Khách lẻ",
            "0909000000",
            DateTimeOffset.UtcNow.AddHours(1),
            DateTimeOffset.UtcNow.AddHours(2),
            180_000m,
            "confirmed");
        var newCourt = Guid.NewGuid();

        booking.Reschedule(
            newCourt,
            DateTimeOffset.UtcNow.AddHours(3),
            DateTimeOffset.UtcNow.AddHours(5),
            440_000m);

        Assert.Equal(newCourt, booking.CourtId);
        Assert.Equal(440_000m, booking.Amount);
    }
}
