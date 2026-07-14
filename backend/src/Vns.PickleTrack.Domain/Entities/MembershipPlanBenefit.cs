using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class MembershipPlanBenefit : Entity
{
    private MembershipPlanBenefit()
    {
    }

    public MembershipPlanBenefit(
        Guid membershipPlanId,
        string benefitCode,
        string label,
        string valueText,
        int displayOrder = 0,
        bool isHighlighted = false)
    {
        MembershipPlanId = membershipPlanId;
        BenefitCode = NormalizeRequired(benefitCode, nameof(benefitCode));
        Label = NormalizeRequired(label, nameof(label));
        ValueText = NormalizeRequired(valueText, nameof(valueText));
        DisplayOrder = displayOrder;
        IsHighlighted = isHighlighted;
    }

    public Guid MembershipPlanId { get; private set; }

    public string BenefitCode { get; private set; } = string.Empty;

    public string Label { get; private set; } = string.Empty;

    public string ValueText { get; private set; } = string.Empty;

    public int DisplayOrder { get; private set; }

    public bool IsHighlighted { get; private set; }

    private static string NormalizeRequired(string value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException($"{name} is required.", name);
        }

        return value.Trim();
    }
}
