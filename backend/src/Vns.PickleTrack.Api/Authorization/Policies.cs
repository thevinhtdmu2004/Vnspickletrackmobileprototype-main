namespace Vns.PickleTrack.Api.Authorization;

public static class Policies
{
    public const string AdminOnly = nameof(AdminOnly);
    public const string CoachOnly = nameof(CoachOnly);
    public const string CoachOrAdmin = nameof(CoachOrAdmin);
    public const string MemberOnly = nameof(MemberOnly);
}
