using Vns.PickleTrack.Domain.Rules;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class ScheduleRulesTests
{
    private static readonly DateTimeOffset Day =
        new(2026, 6, 14, 0, 0, 0, TimeSpan.Zero);

    [Theory]
    [InlineData(16, 0, 17, 30, 16, 0, 17, 30)]
    [InlineData(16, 0, 17, 30, 16, 30, 17, 0)]
    [InlineData(19, 0, 20, 30, 18, 30, 19, 30)]
    public void Overlaps_ReturnsTrue_WhenRangesIntersect(
        int leftHour,
        int leftMinute,
        int leftEndHour,
        int leftEndMinute,
        int rightHour,
        int rightMinute,
        int rightEndHour,
        int rightEndMinute)
    {
        Assert.True(ScheduleRules.Overlaps(
            Day.AddHours(leftHour).AddMinutes(leftMinute),
            Day.AddHours(leftEndHour).AddMinutes(leftEndMinute),
            Day.AddHours(rightHour).AddMinutes(rightMinute),
            Day.AddHours(rightEndHour).AddMinutes(rightEndMinute)));
    }

    [Theory]
    [InlineData(16, 0, 17, 30, 17, 30, 19, 0)]
    [InlineData(19, 0, 20, 30, 17, 30, 19, 0)]
    public void Overlaps_ReturnsFalse_WhenRangesOnlyTouchAtBoundary(
        int leftHour,
        int leftMinute,
        int leftEndHour,
        int leftEndMinute,
        int rightHour,
        int rightMinute,
        int rightEndHour,
        int rightEndMinute)
    {
        Assert.False(ScheduleRules.Overlaps(
            Day.AddHours(leftHour).AddMinutes(leftMinute),
            Day.AddHours(leftEndHour).AddMinutes(leftEndMinute),
            Day.AddHours(rightHour).AddMinutes(rightMinute),
            Day.AddHours(rightEndHour).AddMinutes(rightEndMinute)));
    }
}
