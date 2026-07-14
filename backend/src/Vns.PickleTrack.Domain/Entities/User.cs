using Vns.PickleTrack.Domain.Common;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Entities;

public sealed class User : Entity
{
    private User()
    {
    }

    public User(string username, string displayName, string pinHash, UserRole role)
    {
        Username = username;
        DisplayName = displayName;
        PinHash = pinHash;
        Role = role;
    }

    public string Username { get; private set; } = string.Empty;

    public string DisplayName { get; private set; } = string.Empty;

    public string PinHash { get; private set; } = string.Empty;

    public UserRole Role { get; private set; }

    public bool IsActive { get; private set; } = true;

    public void ChangeRole(UserRole role)
    {
        Role = role;
        MarkUpdated();
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
        MarkUpdated();
    }

    public void UpdateDisplayName(string displayName)
    {
        if (string.IsNullOrWhiteSpace(displayName))
        {
            throw new ArgumentException("Display name is required.", nameof(displayName));
        }

        DisplayName = displayName.Trim();
        MarkUpdated();
    }
}
