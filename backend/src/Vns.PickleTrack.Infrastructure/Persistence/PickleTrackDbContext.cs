using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Domain.Entities;

namespace Vns.PickleTrack.Infrastructure.Persistence;

public sealed class PickleTrackDbContext(DbContextOptions<PickleTrackDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<Coach> Coaches => Set<Coach>();
    public DbSet<CoachSettlement> CoachSettlements => Set<CoachSettlement>();
    public DbSet<TrainingClass> Classes => Set<TrainingClass>();
    public DbSet<ClassEnrollment> ClassEnrollments => Set<ClassEnrollment>();
    public DbSet<ClassSession> Sessions => Set<ClassSession>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<Package> Packages => Set<Package>();
    public DbSet<PackageLedgerEntry> PackageLedgerEntries => Set<PackageLedgerEntry>();
    public DbSet<RenewalRequest> RenewalRequests => Set<RenewalRequest>();
    public DbSet<PaymentRenewal> PaymentRenewals => Set<PaymentRenewal>();
    public DbSet<MembershipPlan> MembershipPlans => Set<MembershipPlan>();
    public DbSet<MembershipPlanBenefit> MembershipPlanBenefits => Set<MembershipPlanBenefit>();
    public DbSet<MembershipRequest> MembershipRequests => Set<MembershipRequest>();
    public DbSet<MembershipSubscription> MembershipSubscriptions => Set<MembershipSubscription>();
    public DbSet<Court> Courts => Set<Court>();
    public DbSet<CourtBooking> CourtBookings => Set<CourtBooking>();
    public DbSet<CourtScheduleEntry> CourtScheduleEntries => Set<CourtScheduleEntry>();
    public DbSet<CourtOccupancy> CourtOccupancies => Set<CourtOccupancy>();
    public DbSet<CourtPriceRule> CourtPriceRules => Set<CourtPriceRule>();
    public DbSet<BookingConflictResolution> BookingConflictResolutions => Set<BookingConflictResolution>();
    public DbSet<BookingCharge> BookingCharges => Set<BookingCharge>();
    public DbSet<BookingPayment> BookingPayments => Set<BookingPayment>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceLine> InvoiceLines => Set<InvoiceLine>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<PaymentAllocation> PaymentAllocations => Set<PaymentAllocation>();
    public DbSet<Refund> Refunds => Set<Refund>();
    public DbSet<FinanceEntry> FinanceEntries => Set<FinanceEntry>();
    public DbSet<FinanceDebt> FinanceDebts => Set<FinanceDebt>();
    public DbSet<StaffShift> StaffShifts => Set<StaffShift>();
    public DbSet<ShiftHandover> ShiftHandovers => Set<ShiftHandover>();
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
    public DbSet<InventoryMovement> InventoryMovements => Set<InventoryMovement>();
    public DbSet<PosSale> PosSales => Set<PosSale>();
    public DbSet<PosSaleLine> PosSaleLines => Set<PosSaleLine>();
    public DbSet<EquipmentRentalOrder> EquipmentRentalOrders => Set<EquipmentRentalOrder>();
    public DbSet<EquipmentRentalOrderItem> EquipmentRentalOrderItems => Set<EquipmentRentalOrderItem>();
    public DbSet<ContentItem> ContentItems => Set<ContentItem>();
    public DbSet<Promotion> Promotions => Set<Promotion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("pickletrack");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PickleTrackDbContext).Assembly);
    }
}
