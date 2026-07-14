using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Vns.PickleTrack.Domain.Entities;

namespace Vns.PickleTrack.Infrastructure.Persistence;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Username).HasMaxLength(80).IsRequired();
        builder.HasIndex(x => x.Username).IsUnique();
        builder.Property(x => x.DisplayName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.PinHash).HasMaxLength(500).IsRequired();
        builder.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);
    }
}

internal sealed class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.ToTable("members");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.FullName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.PhoneNumber).HasMaxLength(30).IsRequired();
        builder.Property(x => x.SkillLevel).HasMaxLength(80);
        builder.HasIndex(x => x.UserId).IsUnique();
        builder.HasOne<User>()
            .WithOne()
            .HasForeignKey<Member>(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class CoachConfiguration : IEntityTypeConfiguration<Coach>
{
    public void Configure(EntityTypeBuilder<Coach> builder)
    {
        builder.ToTable("coaches");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.FullName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.PartnershipStatus).HasMaxLength(30).IsRequired();
        builder.Property(x => x.AgreementType).HasMaxLength(30).IsRequired();
        builder.Property(x => x.HourlyCourtRate).HasPrecision(18, 2);
        builder.Property(x => x.RevenueSharePercent).HasPrecision(5, 2);
        builder.Property(x => x.AvatarUrl).HasMaxLength(500);
        builder.Property(x => x.PhoneNumber).HasMaxLength(30);
        builder.Property(x => x.Email).HasMaxLength(160);
        builder.Property(x => x.ProfessionalLevel).HasMaxLength(120);
        builder.Property(x => x.Certificates).HasMaxLength(1000);
        builder.Property(x => x.TeachingSkills).HasMaxLength(500);
        builder.Property(x => x.Biography).HasMaxLength(2000);
        builder.Property(x => x.WorkingSchedule).HasMaxLength(1000);
        builder.HasIndex(x => x.UserId).IsUnique();
        builder.HasOne<User>()
            .WithOne()
            .HasForeignKey<Coach>(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class CoachSettlementConfiguration : IEntityTypeConfiguration<CoachSettlement>
{
    public void Configure(EntityTypeBuilder<CoachSettlement> builder)
    {
        builder.ToTable("coach_settlements");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Period).HasMaxLength(7).IsRequired();
        builder.Property(x => x.UsageHours).HasPrecision(10, 2);
        builder.Property(x => x.GrossRevenue).HasPrecision(18, 2);
        builder.Property(x => x.CourtFee).HasPrecision(18, 2);
        builder.Property(x => x.PaidAmount).HasPrecision(18, 2);
        builder.Property(x => x.ReconciliationStatus).HasMaxLength(30).IsRequired();
        builder.Property(x => x.ConfirmedBy).HasMaxLength(160);
        builder.Ignore(x => x.OutstandingAmount);
        builder.HasIndex(x => new { x.CoachId, x.Period }).IsUnique();
        builder.HasOne<Coach>()
            .WithMany()
            .HasForeignKey(x => x.CoachId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class TrainingClassConfiguration : IEntityTypeConfiguration<TrainingClass>
{
    public void Configure(EntityTypeBuilder<TrainingClass> builder)
    {
        builder.ToTable("classes");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(160).IsRequired();
        builder.Property(x => x.CourtName).HasMaxLength(120);
        builder.HasIndex(x => x.CoachId);
        builder.HasIndex(x => x.CourtId);
        builder.HasOne<Court>()
            .WithMany()
            .HasForeignKey(x => x.CourtId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Coach>()
            .WithMany()
            .HasForeignKey(x => x.CoachId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class ClassEnrollmentConfiguration : IEntityTypeConfiguration<ClassEnrollment>
{
    public void Configure(EntityTypeBuilder<ClassEnrollment> builder)
    {
        builder.ToTable("class_enrollments");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.HasIndex(x => new { x.ClassId, x.MemberId }).IsUnique();
        builder.HasIndex(x => new { x.MemberId, x.Status });
        builder.HasOne<TrainingClass>()
            .WithMany()
            .HasForeignKey(x => x.ClassId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Package>()
            .WithMany()
            .HasForeignKey(x => x.PackageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class ClassSessionConfiguration : IEntityTypeConfiguration<ClassSession>
{
    public void Configure(EntityTypeBuilder<ClassSession> builder)
    {
        builder.ToTable("sessions");
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => new { x.ClassId, x.StartsAtUtc });
        builder.HasOne<TrainingClass>()
            .WithMany()
            .HasForeignKey(x => x.ClassId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class AttendanceRecordConfiguration : IEntityTypeConfiguration<AttendanceRecord>
{
    public void Configure(EntityTypeBuilder<AttendanceRecord> builder)
    {
        builder.ToTable("attendance_records");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.HasIndex(x => new { x.SessionId, x.MemberId }).IsUnique();
        builder.HasOne<ClassSession>()
            .WithMany()
            .HasForeignKey(x => x.SessionId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class PackageConfiguration : IEntityTypeConfiguration<Package>
{
    public void Configure(EntityTypeBuilder<Package> builder)
    {
        builder.ToTable("packages");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Price).HasPrecision(18, 2);
        builder.Property(x => x.ValidityDays).HasDefaultValue(30);
        builder.Property(x => x.FreeCourtUses).HasDefaultValue(0);
        builder.Property(x => x.FreeCourtMinutesPerUse).HasDefaultValue(0);
    }
}

internal sealed class PackageLedgerEntryConfiguration : IEntityTypeConfiguration<PackageLedgerEntry>
{
    public void Configure(EntityTypeBuilder<PackageLedgerEntry> builder)
    {
        builder.ToTable("package_ledger_entries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.SourceType).HasConversion<string>().HasMaxLength(40).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.HasIndex(x => new { x.SourceType, x.SourceId }).IsUnique();
        builder.HasIndex(x => new { x.MemberId, x.OccurredAtUtc });
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<ClassEnrollment>()
            .WithMany()
            .HasForeignKey(x => x.ClassEnrollmentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class RenewalRequestConfiguration : IEntityTypeConfiguration<RenewalRequest>
{
    public void Configure(EntityTypeBuilder<RenewalRequest> builder)
    {
        builder.ToTable("renewal_requests");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.HasIndex(x => new { x.MemberId, x.Status });
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Package>()
            .WithMany()
            .HasForeignKey(x => x.PackageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class PaymentRenewalConfiguration : IEntityTypeConfiguration<PaymentRenewal>
{
    public void Configure(EntityTypeBuilder<PaymentRenewal> builder)
    {
        builder.ToTable("payment_renewals");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.PaymentMethod).HasMaxLength(30).IsRequired();
        builder.Property(x => x.PaymentStatus).HasMaxLength(30).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.Property(x => x.FreeCourtUsesGranted).HasDefaultValue(0);
        builder.Property(x => x.FreeCourtUsesUsed).HasDefaultValue(0);
        builder.HasIndex(x => x.MemberId);
        builder.HasIndex(x => new { x.MemberId, x.ExpiresAtUtc });
        builder.Ignore(x => x.FreeCourtUsesRemaining);
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Package>()
            .WithMany()
            .HasForeignKey(x => x.PackageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class MembershipPlanConfiguration : IEntityTypeConfiguration<MembershipPlan>
{
    public void Configure(EntityTypeBuilder<MembershipPlan> builder)
    {
        builder.ToTable("membership_plans");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Code).HasMaxLength(40).IsRequired();
        builder.HasIndex(x => x.Code).IsUnique();
        builder.Property(x => x.Name).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Price).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(1000);
        builder.HasIndex(x => new { x.IsActive, x.DisplayOrder });
    }
}

internal sealed class MembershipPlanBenefitConfiguration : IEntityTypeConfiguration<MembershipPlanBenefit>
{
    public void Configure(EntityTypeBuilder<MembershipPlanBenefit> builder)
    {
        builder.ToTable("membership_plan_benefits");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.BenefitCode).HasMaxLength(60).IsRequired();
        builder.Property(x => x.Label).HasMaxLength(160).IsRequired();
        builder.Property(x => x.ValueText).HasMaxLength(500).IsRequired();
        builder.HasIndex(x => new { x.MembershipPlanId, x.BenefitCode });
        builder.HasOne<MembershipPlan>()
            .WithMany()
            .HasForeignKey(x => x.MembershipPlanId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class MembershipRequestConfiguration : IEntityTypeConfiguration<MembershipRequest>
{
    public void Configure(EntityTypeBuilder<MembershipRequest> builder)
    {
        builder.ToTable("membership_requests");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.RequestType).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.Property(x => x.ReviewNote).HasMaxLength(1000);
        builder.HasIndex(x => new { x.MemberId, x.Status });
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<MembershipPlan>()
            .WithMany()
            .HasForeignKey(x => x.MembershipPlanId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.ReviewedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class MembershipSubscriptionConfiguration : IEntityTypeConfiguration<MembershipSubscription>
{
    public void Configure(EntityTypeBuilder<MembershipSubscription> builder)
    {
        builder.ToTable("membership_subscriptions");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.HasIndex(x => new { x.MemberId, x.IsCurrent });
        builder.HasIndex(x => new { x.MembershipPlanId, x.Status });
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<MembershipPlan>()
            .WithMany()
            .HasForeignKey(x => x.MembershipPlanId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<MembershipRequest>()
            .WithMany()
            .HasForeignKey(x => x.MembershipRequestId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.ActivatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class CourtPriceRuleConfiguration : IEntityTypeConfiguration<CourtPriceRule>
{
    public void Configure(EntityTypeBuilder<CourtPriceRule> builder)
    {
        builder.ToTable("court_price_rules");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CustomerType).HasMaxLength(30).IsRequired();
        builder.Property(x => x.DayType).HasMaxLength(20).IsRequired();
        builder.Property(x => x.PriceType).HasMaxLength(20).HasDefaultValue("regular").IsRequired();
        builder.Property(x => x.HolidayDates).HasMaxLength(2000).HasDefaultValue(string.Empty).IsRequired();
        builder.Property(x => x.HourlyRate).HasPrecision(18, 2);
        builder.Property(x => x.CreatedBy).HasMaxLength(160).IsRequired();
        builder.HasIndex(x => new
        {
            x.CourtId,
            x.PriceType,
            x.CustomerType,
            x.DayType,
            x.EffectiveFrom,
            x.StartTime
        });
    }
}

internal sealed class BookingConflictResolutionConfiguration
    : IEntityTypeConfiguration<BookingConflictResolution>
{
    public void Configure(EntityTypeBuilder<BookingConflictResolution> builder)
    {
        builder.ToTable("booking_conflict_resolutions");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Action).HasMaxLength(30).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(1000).IsRequired();
        builder.Property(x => x.ResolvedBy).HasMaxLength(160).IsRequired();
        builder.HasIndex(x => new { x.BookingId, x.ResolvedAtUtc });
    }
}

internal sealed class CourtConfiguration : IEntityTypeConfiguration<Court>
{
    public void Configure(EntityTypeBuilder<Court> builder)
    {
        builder.ToTable("courts");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(120).IsRequired();
        builder.Property(x => x.CourtType).HasMaxLength(60).HasDefaultValue("standard").IsRequired();
        builder.Property(x => x.Surface).HasMaxLength(80).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(500).HasDefaultValue(string.Empty).IsRequired();
        builder.Property(x => x.Capacity).HasDefaultValue(4);
        builder.Property(x => x.OpensAt).HasDefaultValue(new TimeOnly(5, 0));
        builder.Property(x => x.ClosesAt).HasDefaultValue(new TimeOnly(23, 0));
        builder.Property(x => x.OperationalStatus).HasMaxLength(30).HasDefaultValue("available").IsRequired();
        builder.Property(x => x.HourlyRate).HasPrecision(18, 2);
        builder.HasIndex(x => x.Name).IsUnique();
        builder.HasIndex(x => x.OperationalStatus);
    }
}

internal sealed class CourtBookingConfiguration : IEntityTypeConfiguration<CourtBooking>
{
    public void Configure(EntityTypeBuilder<CourtBooking> builder)
    {
        builder.ToTable("court_bookings");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CustomerName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.CustomerPhone).HasMaxLength(30).IsRequired();
        builder.Property(x => x.BookingCode).HasMaxLength(24).IsRequired();
        builder.HasIndex(x => x.BookingCode).IsUnique();
        builder.Property(x => x.CustomerType).HasMaxLength(20).HasDefaultValue("guest").IsRequired();
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.CourtAmountBeforeBenefit).HasPrecision(18, 2);
        builder.Property(x => x.CourtBenefitDiscount).HasPrecision(18, 2);
        builder.Property(x => x.MembershipBenefitNote).HasMaxLength(300);
        builder.Property(x => x.MembershipPackageName).HasMaxLength(160);
        builder.Property(x => x.PaidAmount).HasPrecision(18, 2);
        builder.Property(x => x.PaymentMethod).HasMaxLength(30);
        builder.Property(x => x.ReceiptCode).HasMaxLength(40);
        builder.Property(x => x.Status).HasMaxLength(30).IsRequired();
        builder.HasIndex(x => new { x.CourtId, x.StartsAtUtc });
        builder.HasOne<Court>()
            .WithMany()
            .HasForeignKey(x => x.CourtId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<PaymentRenewal>()
            .WithMany()
            .HasForeignKey(x => x.AppliedMembershipRenewalId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class CourtScheduleEntryConfiguration : IEntityTypeConfiguration<CourtScheduleEntry>
{
    public void Configure(EntityTypeBuilder<CourtScheduleEntry> builder)
    {
        builder.ToTable("court_schedule_entries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ScheduleType).HasMaxLength(30).IsRequired();
        builder.Property(x => x.OwnerName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Purpose).HasMaxLength(240).IsRequired();
        builder.Property(x => x.Status).HasMaxLength(30).IsRequired();
        builder.HasIndex(x => new { x.CourtId, x.StartsAtUtc });
        builder.HasOne<Court>()
            .WithMany()
            .HasForeignKey(x => x.CourtId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class CourtOccupancyConfiguration : IEntityTypeConfiguration<CourtOccupancy>
{
    public void Configure(EntityTypeBuilder<CourtOccupancy> builder)
    {
        builder.ToTable("court_occupancies");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.SourceType).HasConversion<string>().HasMaxLength(40).IsRequired();
        builder.Property(x => x.Title).HasMaxLength(160).IsRequired();
        builder.Property(x => x.OwnerName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Ignore(x => x.BlocksCourt);
        builder.HasIndex(x => new { x.CourtId, x.StartsAtUtc });
        builder.HasIndex(x => new { x.SourceType, x.SourceId }).IsUnique();
        builder.HasOne<Court>()
            .WithMany()
            .HasForeignKey(x => x.CourtId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.ToTable("invoices");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.InvoiceCode).HasMaxLength(40).IsRequired();
        builder.HasIndex(x => x.InvoiceCode).IsUnique();
        builder.Property(x => x.InvoiceType).HasMaxLength(40).IsRequired();
        builder.Property(x => x.CustomerType).HasMaxLength(40).IsRequired();
        builder.Property(x => x.CustomerName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.SourceType).HasMaxLength(40);
        builder.Property(x => x.GrossAmount).HasPrecision(18, 2);
        builder.Property(x => x.DiscountAmount).HasPrecision(18, 2);
        builder.Property(x => x.PaidAmount).HasPrecision(18, 2);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(1000);
        builder.Ignore(x => x.NetAmount);
        builder.Ignore(x => x.OutstandingAmount);
        builder.HasIndex(x => new { x.SourceType, x.SourceId });
        builder.HasIndex(x => new { x.MemberId, x.IssuedAtUtc });
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class InvoiceLineConfiguration : IEntityTypeConfiguration<InvoiceLine>
{
    public void Configure(EntityTypeBuilder<InvoiceLine> builder)
    {
        builder.ToTable("invoice_lines");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.LineType).HasMaxLength(40).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(240).IsRequired();
        builder.Property(x => x.UnitAmount).HasPrecision(18, 2);
        builder.Property(x => x.SourceType).HasMaxLength(40);
        builder.Ignore(x => x.TotalAmount);
        builder.HasIndex(x => new { x.InvoiceId, x.LineType });
        builder.HasOne<Invoice>()
            .WithMany()
            .HasForeignKey(x => x.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<InventoryItem>()
            .WithMany()
            .HasForeignKey(x => x.InventoryItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.PaymentCode).HasMaxLength(40).IsRequired();
        builder.HasIndex(x => x.PaymentCode).IsUnique();
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.Method).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.ExternalReference).HasMaxLength(120);
        builder.Property(x => x.Note).HasMaxLength(1000);
        builder.HasIndex(x => new { x.PaidAtUtc, x.Status });
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class PaymentAllocationConfiguration : IEntityTypeConfiguration<PaymentAllocation>
{
    public void Configure(EntityTypeBuilder<PaymentAllocation> builder)
    {
        builder.ToTable("payment_allocations");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.HasIndex(x => new { x.PaymentId, x.InvoiceId }).IsUnique();
        builder.HasOne<Payment>()
            .WithMany()
            .HasForeignKey(x => x.PaymentId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Invoice>()
            .WithMany()
            .HasForeignKey(x => x.InvoiceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class RefundConfiguration : IEntityTypeConfiguration<Refund>
{
    public void Configure(EntityTypeBuilder<Refund> builder)
    {
        builder.ToTable("refunds");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.RefundCode).HasMaxLength(40).IsRequired();
        builder.HasIndex(x => x.RefundCode).IsUnique();
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.Reason).HasMaxLength(1000).IsRequired();
        builder.HasIndex(x => new { x.InvoiceId, x.RefundedAtUtc });
        builder.HasOne<Invoice>()
            .WithMany()
            .HasForeignKey(x => x.InvoiceId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class FinanceEntryConfiguration : IEntityTypeConfiguration<FinanceEntry>
{
    public void Configure(EntityTypeBuilder<FinanceEntry> builder)
    {
        builder.ToTable("finance_entries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Code).HasMaxLength(40).IsRequired();
        builder.HasIndex(x => x.Code).IsUnique();
        builder.Property(x => x.Type).HasMaxLength(20).IsRequired();
        builder.Property(x => x.Category).HasMaxLength(40).IsRequired();
        builder.Property(x => x.Counterparty).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.ActualAmount).HasPrecision(18, 2);
        builder.Property(x => x.Method).HasMaxLength(30).IsRequired();
        builder.Property(x => x.ReferenceCode).HasMaxLength(80);
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.Property(x => x.ReconciliationStatus).HasMaxLength(30).IsRequired();
        builder.Property(x => x.BranchName).HasMaxLength(120).HasDefaultValue("Cơ sở chính").IsRequired();
        builder.Property(x => x.CreatedBy).HasMaxLength(160).HasDefaultValue("Hệ thống").IsRequired();
        builder.Property(x => x.ConfirmedBy).HasMaxLength(160);
        builder.HasIndex(x => new { x.OccurredAtUtc, x.Type });
    }
}

internal sealed class FinanceDebtConfiguration : IEntityTypeConfiguration<FinanceDebt>
{
    public void Configure(EntityTypeBuilder<FinanceDebt> builder)
    {
        builder.ToTable("finance_debts");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Direction).HasMaxLength(20).IsRequired();
        builder.Property(x => x.Counterparty).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(300).IsRequired();
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.PaidAmount).HasPrecision(18, 2);
        builder.Property(x => x.SourceType).HasMaxLength(40);
        builder.Property(x => x.CounterpartyType).HasMaxLength(30).HasDefaultValue("other").IsRequired();
        builder.HasIndex(x => new { x.Direction, x.DueAtUtc });
        builder.HasIndex(x => new { x.SourceType, x.SourceId });
    }
}

internal sealed class BookingChargeConfiguration : IEntityTypeConfiguration<BookingCharge>
{
    public void Configure(EntityTypeBuilder<BookingCharge> builder)
    {
        builder.ToTable("booking_charges");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ChargeType).HasMaxLength(30).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(240).IsRequired();
        builder.Property(x => x.UnitAmount).HasPrecision(18, 2);
        builder.Ignore(x => x.TotalAmount);
        builder.HasIndex(x => new { x.BookingId, x.ChargeType });
        builder.HasOne<CourtBooking>()
            .WithMany()
            .HasForeignKey(x => x.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class BookingPaymentConfiguration : IEntityTypeConfiguration<BookingPayment>
{
    public void Configure(EntityTypeBuilder<BookingPayment> builder)
    {
        builder.ToTable("booking_payments");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ReceiptCode).HasMaxLength(40).IsRequired();
        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.Method).HasMaxLength(30).IsRequired();
        builder.Property(x => x.CreatedBy).HasMaxLength(160).IsRequired();
        builder.Property(x => x.TransactionType).HasMaxLength(20).HasDefaultValue("payment").IsRequired();
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.HasIndex(x => x.ReceiptCode).IsUnique();
        builder.HasIndex(x => new { x.BookingId, x.PaidAtUtc });
        builder.HasOne<CourtBooking>()
            .WithMany()
            .HasForeignKey(x => x.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class StaffShiftConfiguration : IEntityTypeConfiguration<StaffShift>
{
    public void Configure(EntityTypeBuilder<StaffShift> builder)
    {
        builder.ToTable("staff_shifts");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.StaffName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Status).HasMaxLength(30).IsRequired();
        builder.HasIndex(x => new { x.StartsAtUtc, x.EndsAtUtc });
    }
}

internal sealed class ShiftHandoverConfiguration : IEntityTypeConfiguration<ShiftHandover>
{
    public void Configure(EntityTypeBuilder<ShiftHandover> builder)
    {
        builder.ToTable("shift_handovers");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.HandedOverBy).HasMaxLength(160).IsRequired();
        builder.Property(x => x.ReceivedBy).HasMaxLength(160).IsRequired();
        builder.Property(x => x.OpeningCash).HasPrecision(18, 2);
        builder.Property(x => x.ClosingCash).HasPrecision(18, 2);
        builder.Property(x => x.IncidentNote).HasMaxLength(1000);
        builder.HasIndex(x => x.ShiftId);
    }
}

internal sealed class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.ToTable("inventory_items");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Sku).HasMaxLength(40).IsRequired();
        builder.HasIndex(x => x.Sku).IsUnique();
        builder.Property(x => x.Name).HasMaxLength(160).IsRequired();
        builder.Property(x => x.Category).HasMaxLength(40).IsRequired();
        builder.Property(x => x.SalePrice).HasPrecision(18, 2);
        builder.Property(x => x.CostPrice).HasPrecision(18, 2);
    }
}

internal sealed class PosSaleConfiguration : IEntityTypeConfiguration<PosSale>
{
    public void Configure(EntityTypeBuilder<PosSale> builder)
    {
        builder.ToTable("pos_sales");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Code).HasMaxLength(40).IsRequired();
        builder.HasIndex(x => x.Code).IsUnique();
        builder.Property(x => x.TotalAmount).HasPrecision(18, 2);
        builder.Property(x => x.CostAmount).HasPrecision(18, 2);
        builder.Property(x => x.ItemsJson).HasColumnType("jsonb").IsRequired();
        builder.Property(x => x.PaymentMethod).HasMaxLength(30).IsRequired();
        builder.Property(x => x.PaymentStatus).HasMaxLength(30).IsRequired();
        builder.Property(x => x.IdempotencyKey).HasMaxLength(80).IsRequired();
        builder.HasIndex(x => x.IdempotencyKey).IsUnique();
        builder.HasIndex(x => x.BookingId);
        builder.HasOne<CourtBooking>()
            .WithMany()
            .HasForeignKey(x => x.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class PosSaleLineConfiguration : IEntityTypeConfiguration<PosSaleLine>
{
    public void Configure(EntityTypeBuilder<PosSaleLine> builder)
    {
        builder.ToTable("pos_sale_lines");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ItemNameSnapshot).HasMaxLength(160).IsRequired();
        builder.Property(x => x.UnitPrice).HasPrecision(18, 2);
        builder.Property(x => x.UnitCost).HasPrecision(18, 2);
        builder.Ignore(x => x.LineAmount);
        builder.Ignore(x => x.CostAmount);
        builder.HasIndex(x => new { x.PosSaleId, x.InventoryItemId });
        builder.HasOne<PosSale>()
            .WithMany()
            .HasForeignKey(x => x.PosSaleId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<InventoryItem>()
            .WithMany()
            .HasForeignKey(x => x.InventoryItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class InventoryMovementConfiguration : IEntityTypeConfiguration<InventoryMovement>
{
    public void Configure(EntityTypeBuilder<InventoryMovement> builder)
    {
        builder.ToTable("inventory_movements");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.MovementType).HasMaxLength(30).IsRequired();
        builder.Property(x => x.UnitCost).HasPrecision(18, 2);
        builder.Property(x => x.ReferenceCode).HasMaxLength(80).IsRequired();
        builder.Property(x => x.CreatedBy).HasMaxLength(160).IsRequired();
        builder.Ignore(x => x.TotalCost);
        builder.HasIndex(x => new { x.InventoryItemId, x.CreatedAtUtc });
        builder.HasIndex(x => new { x.InventoryItemId, x.ReferenceCode, x.MovementType }).IsUnique();
        builder.HasOne<InventoryItem>()
            .WithMany()
            .HasForeignKey(x => x.InventoryItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class EquipmentRentalOrderConfiguration : IEntityTypeConfiguration<EquipmentRentalOrder>
{
    public void Configure(EntityTypeBuilder<EquipmentRentalOrder> builder)
    {
        builder.ToTable("equipment_rental_orders");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(1000);
        builder.HasIndex(x => new { x.MemberId, x.RentalDate });
        builder.HasIndex(x => x.CourtBookingId);
        builder.HasOne<Member>()
            .WithMany()
            .HasForeignKey(x => x.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<CourtBooking>()
            .WithMany()
            .HasForeignKey(x => x.CourtBookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class EquipmentRentalOrderItemConfiguration : IEntityTypeConfiguration<EquipmentRentalOrderItem>
{
    public void Configure(EntityTypeBuilder<EquipmentRentalOrderItem> builder)
    {
        builder.ToTable("equipment_rental_order_items");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.SurchargeAmount).HasPrecision(18, 2);
        builder.Property(x => x.Note).HasMaxLength(1000);
        builder.HasIndex(x => new { x.EquipmentRentalOrderId, x.InventoryItemId });
        builder.HasOne<EquipmentRentalOrder>()
            .WithMany()
            .HasForeignKey(x => x.EquipmentRentalOrderId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<InventoryItem>()
            .WithMany()
            .HasForeignKey(x => x.InventoryItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

internal sealed class ContentItemConfiguration : IEntityTypeConfiguration<ContentItem>
{
    public void Configure(EntityTypeBuilder<ContentItem> builder)
    {
        builder.ToTable("content_items");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.ContentType).HasMaxLength(40).IsRequired();
        builder.Property(x => x.Status).HasMaxLength(30).IsRequired();
        builder.Property(x => x.Summary).HasMaxLength(1000).IsRequired();
        builder.Property(x => x.CreatedByName).HasMaxLength(160).IsRequired();
        builder.Property(x => x.ReviewedByName).HasMaxLength(160);
        builder.Property(x => x.RejectionReason).HasMaxLength(1000);
        builder.HasIndex(x => new { x.Status, x.PackageId });
    }
}

internal sealed class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
{
    public void Configure(EntityTypeBuilder<Promotion> builder)
    {
        builder.ToTable("promotions");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.MemberGroup).HasMaxLength(80).IsRequired();
        builder.Property(x => x.BenefitType).HasMaxLength(30).IsRequired();
        builder.Property(x => x.BenefitValue).HasPrecision(18, 2);
        builder.Property(x => x.Conditions).HasMaxLength(1000).IsRequired();
        builder.HasIndex(x => new { x.MemberGroup, x.StartsAtUtc, x.EndsAtUtc });
    }
}
