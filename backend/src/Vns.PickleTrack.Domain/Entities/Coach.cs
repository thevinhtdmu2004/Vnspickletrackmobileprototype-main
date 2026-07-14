using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Coach : Entity
{
    private Coach()
    {
    }

    public Coach(
        Guid userId,
        string fullName,
        string partnershipStatus = "active",
        string agreementType = "hourlyRental",
        decimal hourlyCourtRate = 150_000m,
        decimal revenueSharePercent = 0m)
    {
        UserId = userId;
        FullName = fullName;
        PartnershipStatus = partnershipStatus;
        AgreementType = agreementType;
        HourlyCourtRate = hourlyCourtRate;
        RevenueSharePercent = revenueSharePercent;
        PartnershipStartedAtUtc = DateTimeOffset.UtcNow;
    }

    public Guid UserId { get; private set; }

    public string FullName { get; private set; } = string.Empty;

    public bool IsActive { get; private set; } = true;

    public string PartnershipStatus { get; private set; } = string.Empty;

    public string AgreementType { get; private set; } = string.Empty;

    public decimal HourlyCourtRate { get; private set; }

    public decimal RevenueSharePercent { get; private set; }

    public DateTimeOffset PartnershipStartedAtUtc { get; private set; }

    public string? AvatarUrl { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? Email { get; private set; }
    public string? ProfessionalLevel { get; private set; }
    public string? Certificates { get; private set; }
    public int ExperienceYears { get; private set; }
    public string? TeachingSkills { get; private set; }
    public string? Biography { get; private set; }
    public string? WorkingSchedule { get; private set; }

    public void UpdateAgreement(
        string partnershipStatus,
        string agreementType,
        decimal hourlyCourtRate,
        decimal revenueSharePercent)
    {
        if (partnershipStatus is not ("active" or "paused" or "underReview"))
        {
            throw new ArgumentOutOfRangeException(nameof(partnershipStatus));
        }
        if (agreementType is not ("hourlyRental" or "revenueShare" or "hybrid"))
        {
            throw new ArgumentOutOfRangeException(nameof(agreementType));
        }
        if (hourlyCourtRate < 0 || revenueSharePercent is < 0 or > 100)
        {
            throw new ArgumentOutOfRangeException(nameof(hourlyCourtRate));
        }

        PartnershipStatus = partnershipStatus;
        AgreementType = agreementType;
        HourlyCourtRate = hourlyCourtRate;
        RevenueSharePercent = revenueSharePercent;
        IsActive = partnershipStatus == "active";
        MarkUpdated();
    }

    public void UpdateProfile(
        string? avatarUrl,
        string? phoneNumber,
        string? email,
        string? professionalLevel,
        string? certificates,
        int experienceYears,
        string? teachingSkills,
        string? biography,
        string? workingSchedule)
    {
        if (experienceYears is < 0 or > 80)
        {
            throw new ArgumentOutOfRangeException(nameof(experienceYears));
        }

        AvatarUrl = Normalize(avatarUrl);
        PhoneNumber = Normalize(phoneNumber);
        Email = Normalize(email);
        ProfessionalLevel = Normalize(professionalLevel);
        Certificates = Normalize(certificates);
        ExperienceYears = experienceYears;
        TeachingSkills = Normalize(teachingSkills);
        Biography = Normalize(biography);
        WorkingSchedule = Normalize(workingSchedule);
        MarkUpdated();
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        PartnershipStatus = isActive ? "active" : "paused";
        MarkUpdated();
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
