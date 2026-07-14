using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class MembershipPlan : Entity
{
    private MembershipPlan()
    {
    }

    public MembershipPlan(
        string code,
        string name,
        int durationMonths,
        decimal price,
        bool canRegisterStudent,
        bool hasPriorityCourtWindow,
        string? notes = null)
    {
        Update(code, name, durationMonths, price, canRegisterStudent, hasPriorityCourtWindow, notes);
    }

    public string Code { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public int DurationMonths { get; private set; }

    public decimal Price { get; private set; }

    public bool CanRegisterStudent { get; private set; }

    public bool HasPriorityCourtWindow { get; private set; }

    public int DisplayOrder { get; private set; }

    public string? Notes { get; private set; }

    public bool IsActive { get; private set; } = true;

    public void Update(
        string code,
        string name,
        int durationMonths,
        decimal price,
        bool canRegisterStudent,
        bool hasPriorityCourtWindow,
        string? notes = null,
        int displayOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(code) ||
            string.IsNullOrWhiteSpace(name) ||
            durationMonths <= 0 ||
            price < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(durationMonths));
        }

        Code = code.Trim();
        Name = name.Trim();
        DurationMonths = durationMonths;
        Price = price;
        CanRegisterStudent = canRegisterStudent;
        HasPriorityCourtWindow = hasPriorityCourtWindow;
        Notes = Normalize(notes);
        DisplayOrder = displayOrder;
        MarkUpdated();
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
