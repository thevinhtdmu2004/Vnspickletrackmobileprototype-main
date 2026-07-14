using Vns.PickleTrack.Domain.Common;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class Member : Entity
{
    private Member()
    {
    }

    public Member(
        Guid userId,
        string fullName,
        string phoneNumber,
        string? skillLevel = null)
    {
        UserId = userId;
        FullName = fullName;
        PhoneNumber = phoneNumber;
        SkillLevel = skillLevel;
    }

    public Guid UserId { get; private set; }

    public string FullName { get; private set; } = string.Empty;

    public string PhoneNumber { get; private set; } = string.Empty;

    public string? SkillLevel { get; private set; }

    public bool IsActive { get; private set; } = true;

    public void UpdateProfile(string fullName, string phoneNumber, string? skillLevel)
    {
        if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(phoneNumber))
        {
            throw new ArgumentException("Member name and phone are required.");
        }

        FullName = fullName.Trim();
        PhoneNumber = phoneNumber.Trim();
        SkillLevel = string.IsNullOrWhiteSpace(skillLevel) ? null : skillLevel.Trim();
        MarkUpdated();
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        MarkUpdated();
    }
}
