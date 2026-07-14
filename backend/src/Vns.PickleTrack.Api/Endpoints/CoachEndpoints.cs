using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Api.Authorization;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Application.Routes;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static class CoachEndpoints
{
    public static IEndpointRouteBuilder MapCoachEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup($"{ApiRoutes.Root}/coach")
            .WithTags("Coach")
            .RequireAuthorization(Policies.CoachOnly);

        group.MapGet("/students", GetStudentsAsync);

        return endpoints;
    }

    private static async Task<IResult> GetStudentsAsync(
        ClaimsPrincipal user,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var userIdValue = user.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Results.Unauthorized();
        }

        var coach = await dbContext.Coaches
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.UserId == userId, cancellationToken);
        if (coach is null)
        {
            return Results.Forbid();
        }

        var classes = await dbContext.Classes
            .AsNoTracking()
            .Where(item => item.CoachId == coach.Id && item.IsActive)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var classIds = classes.Select(item => item.Id).ToArray();
        if (classIds.Length == 0)
        {
            return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminMemberResponse>>.Ok([]));
        }

        var sessions = await dbContext.Sessions
            .AsNoTracking()
            .Where(item => classIds.Contains(item.ClassId))
            .ToListAsync(cancellationToken);
        var sessionById = sessions.ToDictionary(item => item.Id);
        var sessionIds = sessionById.Keys.ToArray();
        var attendance = await dbContext.AttendanceRecords
            .AsNoTracking()
            .Where(item => sessionIds.Contains(item.SessionId))
            .ToListAsync(cancellationToken);
        var memberIds = attendance.Select(item => item.MemberId).Distinct().ToArray();
        var members = await dbContext.Members
            .AsNoTracking()
            .Where(item => memberIds.Contains(item.Id))
            .OrderBy(item => item.FullName)
            .ToListAsync(cancellationToken);
        var payments = await dbContext.PaymentRenewals
            .AsNoTracking()
            .Where(item => memberIds.Contains(item.MemberId))
            .ToListAsync(cancellationToken);
        var classesById = classes.ToDictionary(item => item.Id);

        var rows = members.Select(member =>
        {
            var memberPayments = payments.Where(item => item.MemberId == member.Id).ToArray();
            var memberAttendance = attendance.Where(item => item.MemberId == member.Id).ToArray();
            var totalSessions = memberPayments.Sum(item => item.SessionsAdded);
            var attendedSessions = memberAttendance.Count(item => item.DeductsSession);
            var remainingSessions = Math.Max(0, totalSessions - attendedSessions);
            var latestClassId = memberAttendance
                .Select(item => sessionById.GetValueOrDefault(item.SessionId))
                .Where(item => item is not null)
                .OrderByDescending(item => item!.StartsAtUtc)
                .Select(item => item!.ClassId)
                .FirstOrDefault();
            var className = classesById.GetValueOrDefault(latestClassId)?.Name
                ?? member.SkillLevel
                ?? "Chua xep lop";
            var status = !member.IsActive ? "inactive" :
                remainingSessions == 0 ? "expired" :
                remainingSessions <= 3 ? "expiring" : "active";

            return new AdminMemberResponse(
                member.Id,
                member.FullName,
                member.PhoneNumber,
                className,
                totalSessions,
                attendedSessions,
                remainingSessions,
                status);
        }).ToArray();

        return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminMemberResponse>>.Ok(rows));
    }
}
