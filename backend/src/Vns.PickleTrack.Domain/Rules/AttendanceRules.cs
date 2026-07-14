using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Domain.Rules;

public static class AttendanceRules
{
    public static bool DeductsSession(AttendanceStatus status)
    {
        return status is AttendanceStatus.Present
            or AttendanceStatus.Late
            or AttendanceStatus.Makeup;
    }

    public static int SessionDelta(AttendanceStatus status)
    {
        return DeductsSession(status) ? -1 : 0;
    }
}
