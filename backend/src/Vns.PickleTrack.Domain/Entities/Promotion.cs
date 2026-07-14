using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Promotion : Entity
{
    private Promotion() { }

    public Promotion(
        string name,
        string memberGroup,
        string benefitType,
        decimal benefitValue,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        string conditions)
    {
        Name = name;
        MemberGroup = memberGroup;
        BenefitType = benefitType;
        BenefitValue = benefitValue;
        StartsAtUtc = startsAtUtc;
        EndsAtUtc = endsAtUtc;
        Conditions = conditions;
    }

    public string Name { get; private set; } = string.Empty;
    public string MemberGroup { get; private set; } = string.Empty;
    public string BenefitType { get; private set; } = string.Empty;
    public decimal BenefitValue { get; private set; }
    public DateTimeOffset StartsAtUtc { get; private set; }
    public DateTimeOffset EndsAtUtc { get; private set; }
    public string Conditions { get; private set; } = string.Empty;
}
