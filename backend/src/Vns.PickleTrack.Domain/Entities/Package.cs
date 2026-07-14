using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Package : Entity
{
    private Package()
    {
    }

    public Package(
        string name,
        int sessionCount,
        decimal price,
        int validityDays = 30,
        int freeCourtUses = 0,
        int freeCourtMinutesPerUse = 0)
    {
        Name = name;
        SessionCount = sessionCount;
        Price = price;
        ValidityDays = validityDays;
        FreeCourtUses = freeCourtUses;
        FreeCourtMinutesPerUse = freeCourtMinutesPerUse;
    }

    public string Name { get; private set; } = string.Empty;

    public int SessionCount { get; private set; }

    public decimal Price { get; private set; }

    public int ValidityDays { get; private set; } = 30;

    public int FreeCourtUses { get; private set; }

    public int FreeCourtMinutesPerUse { get; private set; }

    public bool IncludesFreeCourt => FreeCourtUses > 0 && FreeCourtMinutesPerUse > 0;

    public bool IsActive { get; private set; } = true;

    public void Update(
        string name,
        int sessionCount,
        decimal price,
        int validityDays = 30,
        int freeCourtUses = 0,
        int freeCourtMinutesPerUse = 0)
    {
        if (string.IsNullOrWhiteSpace(name) ||
            sessionCount <= 0 ||
            price < 0 ||
            validityDays <= 0 ||
            freeCourtUses < 0 ||
            freeCourtMinutesPerUse < 0 ||
            (freeCourtUses == 0) != (freeCourtMinutesPerUse == 0))
        {
            throw new ArgumentOutOfRangeException(nameof(sessionCount));
        }

        Name = name.Trim();
        SessionCount = sessionCount;
        Price = price;
        ValidityDays = validityDays;
        FreeCourtUses = freeCourtUses;
        FreeCourtMinutesPerUse = freeCourtMinutesPerUse;
        MarkUpdated();
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        MarkUpdated();
    }
}
