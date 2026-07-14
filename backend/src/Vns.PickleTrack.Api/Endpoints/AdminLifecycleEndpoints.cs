using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Domain.Enums;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static partial class AdminEndpoints
{
    private static async Task<IResult> UpdateFinanceDebtAsync(
        Guid id,
        UpdateFinanceDebtRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (debt is null) return Results.NotFound();
        if (!DateOnly.TryParseExact(request.DueDate, "yyyy-MM-dd", out var dueDate))
            return Results.BadRequest(ApiEnvelope<object>.Fail("Hạn thanh toán không hợp lệ."));

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var dueAtUtc = ToFinanceUtc(dueDate, new TimeOnly(23, 59), timeZone);
        try
        {
            debt.UpdateDetails(
                request.Direction,
                request.Counterparty,
                request.Description,
                request.Amount,
                dueAtUtc,
                NormalizeCounterpartyType(request.CounterpartyType));
        }
        catch (ArgumentOutOfRangeException)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số tiền công nợ không được nhỏ hơn số đã thanh toán."));
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { debt.Id }, "Đã cập nhật công nợ."));
    }

    private static async Task<IResult> CancelFinanceDebtAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (debt is null) return Results.NotFound();
        try
        {
            debt.Cancel();
        }
        catch (InvalidOperationException)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Khoản nợ đã phát sinh thanh toán nên không thể hủy."));
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { debt.Id }, "Đã hủy khoản công nợ."));
    }

    private static async Task<IResult> GetStaffMembersAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var rows = await dbContext.Users.AsNoTracking()
            .Where(item => item.Role == UserRole.Admin)
            .OrderBy(item => item.DisplayName)
            .Select(item => new AdminStaffMemberResponse(
                item.Id, item.DisplayName, item.Username, item.IsActive))
            .ToListAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminStaffMemberResponse>>.Ok(rows));
    }

    private static async Task<IResult> GetAdminPackagesAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var rows = await dbContext.Packages.AsNoTracking()
            .OrderByDescending(item => item.IsActive)
            .ThenBy(item => item.Price)
            .Select(item => new AdminPackageResponse(
                item.Id, item.Name, item.SessionCount, item.Price, item.IsActive,
                item.ValidityDays, item.FreeCourtUses, item.FreeCourtMinutesPerUse))
            .ToListAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminPackageResponse>>.Ok(rows));
    }

    private static async Task<IResult> CreateAdminPackageAsync(
        SaveAdminPackageRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!IsValidPackageRequest(request))
            return Results.BadRequest(ApiEnvelope<object>.Fail("Thông tin gói học không hợp lệ."));
        var package = new Package(
            request.Name.Trim(),
            request.SessionCount,
            request.Price,
            request.ValidityDays,
            request.FreeCourtUses,
            request.FreeCourtMinutesPerUse);
        await dbContext.Packages.AddAsync(package, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created($"/api/v1/admin/packages/{package.Id}",
            ApiEnvelope<object>.Ok(new { package.Id }, "Đã tạo gói học."));
    }

    private static async Task<IResult> UpdateAdminPackageAsync(
        Guid id,
        SaveAdminPackageRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var package = await dbContext.Packages.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (package is null) return Results.NotFound();
        if (!IsValidPackageRequest(request))
            return Results.BadRequest(ApiEnvelope<object>.Fail("Thông tin gói không hợp lệ."));
        try
        {
            package.Update(
                request.Name,
                request.SessionCount,
                request.Price,
                request.ValidityDays,
                request.FreeCourtUses,
                request.FreeCourtMinutesPerUse);
        }
        catch (ArgumentException) { return Results.BadRequest(ApiEnvelope<object>.Fail("Thông tin gói học không hợp lệ.")); }
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { package.Id }, "Đã cập nhật gói học."));
    }

    private static async Task<IResult> SetAdminPackageStatusAsync(
        Guid id,
        SetActiveRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var package = await dbContext.Packages.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (package is null) return Results.NotFound();
        package.SetActive(request.IsActive);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { package.Id, package.IsActive }));
    }

    private static async Task<IResult> DeleteAdminPackageAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var package = await dbContext.Packages.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (package is null) return Results.NotFound();
        var inUse = await dbContext.PaymentRenewals.AnyAsync(item => item.PackageId == id, cancellationToken) ||
                    await dbContext.ContentItems.AnyAsync(item => item.PackageId == id, cancellationToken);
        if (inUse) return Results.Conflict(ApiEnvelope<object>.Fail(
            "Gói đã phát sinh dữ liệu; hãy ngừng dùng thay vì xóa."));
        dbContext.Packages.Remove(package);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.NoContent();
    }

    private static bool IsValidPackageRequest(SaveAdminPackageRequest request) =>
        !string.IsNullOrWhiteSpace(request.Name) &&
        request.SessionCount > 0 &&
        request.Price >= 0 &&
        request.ValidityDays > 0 &&
        request.FreeCourtUses >= 0 &&
        request.FreeCourtMinutesPerUse >= 0 &&
        (request.FreeCourtUses == 0) == (request.FreeCourtMinutesPerUse == 0);

    private static async Task<IResult> UpdateMemberAsync(
        Guid id,
        UpdateMemberRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var member = await dbContext.Members.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (member is null) return Results.NotFound();
        try { member.UpdateProfile(request.FullName, request.PhoneNumber, request.SkillLevel); }
        catch (ArgumentException) { return Results.BadRequest(ApiEnvelope<object>.Fail("Thông tin hội viên không hợp lệ.")); }
        var user = await dbContext.Users.SingleAsync(item => item.Id == member.UserId, cancellationToken);
        user.UpdateDisplayName(member.FullName);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { member.Id }, "Đã cập nhật hội viên."));
    }

    private static async Task<IResult> SetMemberStatusAsync(
        Guid id,
        SetActiveRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var member = await dbContext.Members.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (member is null) return Results.NotFound();
        var user = await dbContext.Users.SingleAsync(item => item.Id == member.UserId, cancellationToken);
        member.SetActive(request.IsActive);
        user.SetActive(request.IsActive);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { member.Id, member.IsActive }));
    }

    private static async Task<IResult> DeleteMemberAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var member = await dbContext.Members.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (member is null) return Results.NotFound();
        var inUse = await dbContext.PaymentRenewals.AnyAsync(item => item.MemberId == id, cancellationToken) ||
                    await dbContext.AttendanceRecords.AnyAsync(item => item.MemberId == id, cancellationToken);
        if (inUse) return Results.Conflict(ApiEnvelope<object>.Fail(
            "Hội viên đã phát sinh lịch sử; hãy vô hiệu hóa thay vì xóa."));
        var user = await dbContext.Users.SingleAsync(item => item.Id == member.UserId, cancellationToken);
        dbContext.Members.Remove(member);
        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IResult> UpgradeMemberToCoachAsync(
        Guid id,
        UpgradeMemberToCoachRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var member = await dbContext.Members.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (member is null) return Results.NotFound();
        if (await dbContext.Coaches.AnyAsync(item => item.UserId == member.UserId, cancellationToken))
            return Results.Conflict(ApiEnvelope<object>.Fail("Hội viên đã được liên kết với hồ sơ HLV."));
        var user = await dbContext.Users.SingleAsync(item => item.Id == member.UserId, cancellationToken);
        user.ChangeRole(UserRole.Coach);
        var coach = new Coach(member.UserId, member.FullName, "active",
            request.AgreementType, request.HourlyCourtRate, request.RevenueSharePercent);
        await dbContext.Coaches.AddAsync(coach, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created($"/api/v1/admin/coaches/{coach.Id}",
            ApiEnvelope<object>.Ok(new { coach.Id, MemberId = member.Id }, "Đã nâng cấp hội viên thành HLV."));
    }

    private static async Task<IResult> SetCoachStatusAsync(
        Guid id,
        SetActiveRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var coach = await dbContext.Coaches.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (coach is null) return Results.NotFound();
        var user = await dbContext.Users.SingleAsync(item => item.Id == coach.UserId, cancellationToken);
        coach.SetActive(request.IsActive);
        user.SetActive(request.IsActive);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { coach.Id, coach.IsActive }));
    }

    private static async Task<IResult> DowngradeCoachAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var coach = await dbContext.Coaches.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (coach is null) return Results.NotFound();
        var member = await dbContext.Members.SingleOrDefaultAsync(item => item.UserId == coach.UserId, cancellationToken);
        if (member is null) return Results.Conflict(ApiEnvelope<object>.Fail(
            "HLV không liên kết hội viên nên không thể hạ về quyền hội viên."));
        var user = await dbContext.Users.SingleAsync(item => item.Id == coach.UserId, cancellationToken);
        coach.SetActive(false);
        user.ChangeRole(UserRole.Member);
        user.SetActive(true);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(
            new { CoachId = coach.Id, MemberId = member.Id },
            "Đã hạ quyền HLV về hội viên."));
    }

    private static async Task<IResult> DeleteCoachAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var coach = await dbContext.Coaches.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (coach is null) return Results.NotFound();
        var inUse = await dbContext.Classes.AnyAsync(item => item.CoachId == id, cancellationToken) ||
                    await dbContext.CoachSettlements.AnyAsync(item => item.CoachId == id, cancellationToken);
        if (inUse) return Results.Conflict(ApiEnvelope<object>.Fail(
            "HLV đã phát sinh lớp hoặc đối soát; hãy vô hiệu hóa thay vì xóa."));
        var memberExists = await dbContext.Members.AnyAsync(item => item.UserId == coach.UserId, cancellationToken);
        var user = await dbContext.Users.SingleAsync(item => item.Id == coach.UserId, cancellationToken);
        dbContext.Coaches.Remove(coach);
        if (memberExists) user.ChangeRole(UserRole.Member); else dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IResult> GetSystemAlertsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var upcomingBookings = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => item.Status != "cancelled" &&
                           item.EndsAtUtc >= DateTimeOffset.UtcNow.AddDays(-1) &&
                           item.StartsAtUtc <= DateTimeOffset.UtcNow.AddDays(7))
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var courtNames = await dbContext.Courts.AsNoTracking()
            .ToDictionaryAsync(item => item.Id, item => item.Name, cancellationToken);
        var conflicts = upcomingBookings
            .GroupBy(item => item.CourtId)
            .SelectMany(group =>
            {
                var ordered = group.OrderBy(item => item.StartsAtUtc).ToArray();
                return ordered.SelectMany((left, index) => ordered.Skip(index + 1)
                    .Where(right => left.StartsAtUtc < right.EndsAtUtc &&
                                    left.EndsAtUtc > right.StartsAtUtc)
                    .Select(right => new AdminSystemAlertResponse(
                        "bookingConflict",
                        "critical",
                        "Xung đột lịch đặt sân",
                        $"{courtNames.GetValueOrDefault(left.CourtId) ?? "Sân"}: {left.BookingCode} trùng {right.BookingCode}")));
            })
            .ToList();
        var lowStock = await dbContext.InventoryItems.AsNoTracking()
            .Where(item => item.Quantity <= item.ReorderLevel)
            .Select(item => new AdminSystemAlertResponse(
                "lowStock", item.Quantity == 0 ? "critical" : "warning",
                "Tồn kho sắp hết", $"{item.Name} còn {item.Quantity}"))
            .ToListAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminSystemAlertResponse>>.Ok(
            conflicts.Concat(lowStock).ToArray()));
    }
}

public sealed record UpdateFinanceDebtRequest(
    string Direction, string CounterpartyType, string Counterparty,
    string Description, decimal Amount, string DueDate);
public sealed record AdminStaffMemberResponse(Guid Id, string Name, string Username, bool IsActive);
public sealed record AdminPackageResponse(
    Guid Id, string Name, int SessionCount, decimal Price, bool IsActive,
    int ValidityDays, int FreeCourtUses, int FreeCourtMinutesPerUse);
public sealed record SaveAdminPackageRequest(
    string Name, int SessionCount, decimal Price,
    int ValidityDays = 30, int FreeCourtUses = 0, int FreeCourtMinutesPerUse = 0);
public sealed record SetActiveRequest(bool IsActive);
public sealed record UpdateMemberRequest(string FullName, string PhoneNumber, string? SkillLevel);
public sealed record UpgradeMemberToCoachRequest(
    string AgreementType, decimal HourlyCourtRate, decimal RevenueSharePercent);
