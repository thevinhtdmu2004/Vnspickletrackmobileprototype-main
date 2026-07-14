namespace Vns.PickleTrack.Domain.Rules;

public static class ScheduleRules
{
    public static bool Overlaps(
        DateTimeOffset leftStart,
        DateTimeOffset leftEnd,
        DateTimeOffset rightStart,
        DateTimeOffset rightEnd) =>
        leftStart < rightEnd && leftEnd > rightStart;
}
