using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class EquipmentRentalOrder : Entity
{
    private EquipmentRentalOrder()
    {
    }

    public EquipmentRentalOrder(
        Guid memberId,
        DateOnly rentalDate,
        Guid? courtBookingId = null,
        string? note = null)
    {
        MemberId = memberId;
        CourtBookingId = courtBookingId;
        RentalDate = rentalDate;
        Note = Normalize(note);
    }

    public Guid MemberId { get; private set; }

    public Guid? CourtBookingId { get; private set; }

    public DateOnly RentalDate { get; private set; }

    public EquipmentRentalStatus Status { get; private set; } = EquipmentRentalStatus.Requested;

    public string? Note { get; private set; }

    public DateTimeOffset? ReceivedAtUtc { get; private set; }

    public DateTimeOffset? ReturnedAtUtc { get; private set; }

    public DateTimeOffset? ClosedAtUtc { get; private set; }

    public void MarkReceived()
    {
        Status = EquipmentRentalStatus.Received;
        ReceivedAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }

    public void MarkReturned()
    {
        Status = EquipmentRentalStatus.Returned;
        ReturnedAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }

    public void CloseLost()
    {
        Status = EquipmentRentalStatus.LostClosed;
        ClosedAtUtc = DateTimeOffset.UtcNow;
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
