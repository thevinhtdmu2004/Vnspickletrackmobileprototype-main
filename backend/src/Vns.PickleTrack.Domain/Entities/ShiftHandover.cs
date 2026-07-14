using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class ShiftHandover : Entity
{
    private ShiftHandover() { }

    public ShiftHandover(
        Guid shiftId,
        string handedOverBy,
        string receivedBy,
        decimal openingCash,
        decimal closingCash,
        bool inventoryChecked,
        string? incidentNote,
        DateTimeOffset completedAtUtc)
    {
        ShiftId = shiftId;
        HandedOverBy = handedOverBy;
        ReceivedBy = receivedBy;
        OpeningCash = openingCash;
        ClosingCash = closingCash;
        InventoryChecked = inventoryChecked;
        IncidentNote = incidentNote;
        CompletedAtUtc = completedAtUtc;
    }

    public Guid ShiftId { get; private set; }
    public string HandedOverBy { get; private set; } = string.Empty;
    public string ReceivedBy { get; private set; } = string.Empty;
    public decimal OpeningCash { get; private set; }
    public decimal ClosingCash { get; private set; }
    public bool InventoryChecked { get; private set; }
    public string? IncidentNote { get; private set; }
    public DateTimeOffset CompletedAtUtc { get; private set; }
}
