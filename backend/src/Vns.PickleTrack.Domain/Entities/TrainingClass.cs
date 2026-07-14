using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class TrainingClass : Entity
{
    private TrainingClass()
    {
    }

    public TrainingClass(
        string name,
        Guid coachId,
        string? courtName = null,
        Guid? courtId = null)
    {
        Name = name;
        CoachId = coachId;
        CourtName = courtName;
        CourtId = courtId;
    }

    public string Name { get; private set; } = string.Empty;

    public Guid CoachId { get; private set; }

    public string? CourtName { get; private set; }

    public Guid? CourtId { get; private set; }

    public bool IsActive { get; private set; } = true;

    public void AssignCourt(Guid courtId, string courtName)
    {
        CourtId = courtId;
        CourtName = courtName;
        MarkUpdated();
    }
}
