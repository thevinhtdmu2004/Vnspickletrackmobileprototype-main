namespace Vns.PickleTrack.Domain.Enums;

public enum ClassEnrollmentStatus
{
    Active = 1,
    Completed = 2,
    Withdrawn = 3,
    Suspended = 4
}

public enum ClassSessionStatus
{
    Scheduled = 1,
    Confirmed = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5
}

public enum CourtOccupancySourceType
{
    Booking = 1,
    ClassSession = 2,
    CoachPersonalUse = 3,
    Event = 4,
    Maintenance = 5,
    ManualBlock = 6
}

public enum CourtOccupancyStatus
{
    Pending = 1,
    Confirmed = 2,
    InUse = 3,
    Completed = 4,
    Cancelled = 5,
    Blocked = 6
}

public enum PackageKind
{
    Training = 1,
    Membership = 2
}

public enum PackageLedgerSourceType
{
    TrainingPackagePurchase = 1,
    Attendance = 2,
    ManualAdjustment = 3,
    Refund = 4,
    Expiration = 5
}

public enum MembershipRequestType
{
    Register = 1,
    Renew = 2,
    Upgrade = 3,
    Downgrade = 4,
    Cancel = 5
}

public enum MembershipSubscriptionStatus
{
    PendingActivation = 1,
    Active = 2,
    Expired = 3,
    Cancelled = 4,
    Suspended = 5
}

public enum InvoiceStatus
{
    Draft = 1,
    Issued = 2,
    PartiallyPaid = 3,
    Paid = 4,
    Overdue = 5,
    Cancelled = 6,
    Credited = 7
}

public enum PaymentStatus
{
    Pending = 1,
    Posted = 2,
    Failed = 3,
    Reversed = 4,
    Refunded = 5,
    PartiallyRefunded = 6
}

public enum PaymentMethod
{
    Cash = 1,
    BankTransfer = 2,
    Card = 3,
    EWallet = 4,
    Other = 5
}

public enum EquipmentRentalStatus
{
    Requested = 1,
    Received = 2,
    Returned = 3,
    Cancelled = 4,
    LostClosed = 5
}
