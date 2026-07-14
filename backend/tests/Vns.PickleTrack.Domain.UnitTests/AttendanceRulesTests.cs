using Vns.PickleTrack.Domain.Enums;
using Vns.PickleTrack.Domain.Rules;

namespace Vns.PickleTrack.Domain.UnitTests;

public sealed class AttendanceRulesTests
{
    [Theory]
    [InlineData(AttendanceStatus.Present)]
    [InlineData(AttendanceStatus.Late)]
    [InlineData(AttendanceStatus.Makeup)]
    public void DeductsSession_ReturnsTrue_ForDeductingStatuses(
        AttendanceStatus status)
    {
        Assert.True(AttendanceRules.DeductsSession(status));
        Assert.Equal(-1, AttendanceRules.SessionDelta(status));
    }

    [Theory]
    [InlineData(AttendanceStatus.Absent)]
    [InlineData(AttendanceStatus.Leave)]
    public void DeductsSession_ReturnsFalse_ForNonDeductingStatuses(
        AttendanceStatus status)
    {
        Assert.False(AttendanceRules.DeductsSession(status));
        Assert.Equal(0, AttendanceRules.SessionDelta(status));
    }
}
