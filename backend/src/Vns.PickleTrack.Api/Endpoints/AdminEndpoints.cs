using System.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Vns.PickleTrack.Api.Authorization;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Application.Routes;
using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static partial class AdminEndpoints
{
    public static IEndpointRouteBuilder MapAdminEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup($"{ApiRoutes.Root}/admin")
            .WithTags("Admin")
            .RequireAuthorization(Policies.AdminOnly);

        group.MapGet("/dashboard", GetDashboardAsync);
        group.MapGet("/members", () => Results.Json(
            ApiEnvelope<object>.Fail("Danh sach hoc vien thuoc phan he HLV. Chu san chi xem hoi vien tai /api/v1/admin/people-operations."),
            statusCode: StatusCodes.Status403Forbidden));
        group.MapGet("/people-operations", GetPeopleOperationsAsync);
        group.MapPost("/coaches", CreateCoachAsync);
        group.MapPut("/coaches/{id:guid}/agreement", UpdateCoachAgreementAsync);
        group.MapGet("/coach-reconciliations", GetCoachReconciliationsAsync);
        group.MapPost("/coach-settlements/{id:guid}/reconcile", ReconcileCoachSettlementAsync);
        group.MapPost("/coach-settlements/{id:guid}/confirm", ConfirmCoachSettlementAsync);
        group.MapGet("/debts", GetDebtsAsync);
        group.MapPost("/debts", CreateFinanceDebtAsync);
        group.MapPut("/debts/{id:guid}", UpdateFinanceDebtAsync);
        group.MapPost("/debts/{id:guid}/cancel", CancelFinanceDebtAsync);
        group.MapPost("/debts/{id:guid}/payments", RecordDebtPaymentAsync);
        group.MapGet("/staff-operations", GetStaffOperationsAsync);
        group.MapGet("/staff-members", GetStaffMembersAsync);
        group.MapPost("/staff-shifts", CreateStaffShiftAsync);
        group.MapPost("/shift-handovers", CreateShiftHandoverAsync);
        group.MapGet("/inventory-operations", GetInventoryOperationsAsync);
        group.MapPost("/inventory-items/{id:guid}/restock", RestockInventoryItemAsync);
        group.MapPost("/inventory-items/{id:guid}/count", CountInventoryItemAsync);
        group.MapPost("/pos-sales", CreatePosSaleAsync);
        group.MapGet("/experience-operations", GetExperienceOperationsAsync);
        group.MapPost("/content-items", CreateContentItemAsync);
        group.MapPost("/content-items/{id:guid}/review", ReviewContentItemAsync);
        group.MapPost("/promotions", CreatePromotionAsync);
        group.MapGet("/courts", GetCourtsAsync);
        group.MapPost("/courts", CreateCourtAsync);
        group.MapPut("/courts/{id:guid}", UpdateCourtAsync);
        group.MapPost("/courts/{id:guid}/status", SetCourtStatusAsync);
        group.MapDelete("/courts/{id:guid}", DeleteCourtAsync);
        group.MapGet("/court-operations", GetCourtOperationsAsync);
        group.MapPost("/court-schedule-items", CreateCourtScheduleItemAsync);
        group.MapPost("/court-bookings", CreateCourtBookingAsync);
        group.MapGet("/court-bookings/{id:guid}", GetCourtBookingAsync);
        group.MapGet("/court-bookings/{id:guid}/invoice", GetCourtBookingInvoiceAsync);
        group.MapPost("/court-bookings/{id:guid}/charges", AddCourtBookingChargeAsync);
        group.MapPost("/court-bookings/{id:guid}/payments", RecordCourtBookingPaymentAsync);
        group.MapPost("/court-bookings/{id:guid}/refunds", RecordCourtBookingRefundAsync);
        group.MapGet("/booking-conflicts", GetBookingConflictsAsync);
        group.MapPost("/booking-conflicts/{bookingId:guid}/resolve", ResolveBookingConflictAsync);
        group.MapGet("/court-pricing", GetCourtPricingAsync);
        group.MapPost("/court-pricing", CreateCourtPriceRuleAsync);
        group.MapPut("/court-pricing/{id:guid}", UpdateCourtPriceRuleAsync);
        group.MapPost("/court-pricing/{id:guid}/status", SetCourtPriceRuleStatusAsync);
        group.MapDelete("/court-pricing/{id:guid}", DeleteCourtPriceRuleAsync);
        group.MapGet("/packages", GetAdminPackagesAsync);
        group.MapPost("/packages", CreateAdminPackageAsync);
        group.MapPut("/packages/{id:guid}", UpdateAdminPackageAsync);
        group.MapPost("/packages/{id:guid}/status", SetAdminPackageStatusAsync);
        group.MapDelete("/packages/{id:guid}", DeleteAdminPackageAsync);
        group.MapPut("/members/{id:guid}", UpdateMemberAsync);
        group.MapPost("/members/{id:guid}/status", SetMemberStatusAsync);
        group.MapDelete("/members/{id:guid}", DeleteMemberAsync);
        group.MapPost("/members/{id:guid}/upgrade-coach", UpgradeMemberToCoachAsync);
        group.MapPost("/coaches/{id:guid}/status", SetCoachStatusAsync);
        group.MapPost("/coaches/{id:guid}/downgrade", DowngradeCoachAsync);
        group.MapDelete("/coaches/{id:guid}", DeleteCoachAsync);
        group.MapGet("/system-alerts", GetSystemAlertsAsync);
        group.MapGet("/operational-reports", GetOwnerReportsAsync);
        group.MapGet("/renewal-options", GetRenewalOptionsAsync);
        group.MapPost("/member-renewals", CreateMemberRenewalAsync);
        group.MapPut("/coaches/{id:guid}/profile", UpdateCoachProfileAsync);
        group.MapGet("/finance-operations", GetFinanceOperationsAsync);
        group.MapPost("/finance-entries", CreateFinanceEntryAsync);
        group.MapPost("/finance-entries/{id:guid}/reconcile", ReconcileFinanceEntryAsync);

        return endpoints;
    }

    private static async Task<IResult> GetDashboardAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var localToday = DateOnly.FromDateTime(localNow.Date);
        var localDayStart = localToday.ToDateTime(
            TimeOnly.MinValue,
            DateTimeKind.Unspecified);
        var localDayEnd = localToday.AddDays(1).ToDateTime(
            TimeOnly.MinValue,
            DateTimeKind.Unspecified);
        var dayStartUtc = new DateTimeOffset(
            TimeZoneInfo.ConvertTimeToUtc(localDayStart, timeZone));
        var dayEndUtc = new DateTimeOffset(
            TimeZoneInfo.ConvertTimeToUtc(localDayEnd, timeZone));
        var monthStartLocal = new DateTime(
            localNow.Year,
            localNow.Month,
            1,
            0,
            0,
            0,
            DateTimeKind.Unspecified);
        var monthStartUtc = new DateTimeOffset(
            TimeZoneInfo.ConvertTimeToUtc(monthStartLocal, timeZone));

        var todaySessions = await (
            from session in dbContext.Sessions.AsNoTracking()
            join trainingClass in dbContext.Classes.AsNoTracking()
                on session.ClassId equals trainingClass.Id
            join coach in dbContext.Coaches.AsNoTracking()
                on trainingClass.CoachId equals coach.Id
            where session.StartsAtUtc >= dayStartUtc &&
                  session.StartsAtUtc < dayEndUtc &&
                  !session.IsCancelled
            orderby session.StartsAtUtc
            select new
            {
                session.Id,
                trainingClass.CourtName,
                CoachName = coach.FullName,
                session.StartsAtUtc,
                session.EndsAtUtc,
                session.IsCompleted
            }).ToListAsync(cancellationToken);

        var courts = await dbContext.Courts.AsNoTracking().ToListAsync(cancellationToken);
        var courtIdsByName = courts.ToDictionary(item => item.Name, item => item.Id, StringComparer.OrdinalIgnoreCase);
        var dayBookings = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => item.StartsAtUtc < dayEndUtc && item.EndsAtUtc > dayStartUtc && item.Status != "cancelled")
            .ToListAsync(cancellationToken);
        var monthSessions = await dbContext.Sessions.AsNoTracking()
            .Where(item => item.StartsAtUtc >= monthStartUtc && !item.IsCancelled)
            .Select(item => new { item.StartsAtUtc, item.EndsAtUtc })
            .ToListAsync(cancellationToken);
        var monthUsageHours = monthSessions.Sum(item => (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours);
        var lowStockCount = await dbContext.InventoryItems.AsNoTracking()
            .CountAsync(item => item.Quantity <= item.ReorderLevel, cancellationToken);
        var memberRows = await BuildMemberRowsAsync(dbContext, cancellationToken);
        var operationRows = todaySessions.Select(item =>
        {
            var localStart = TimeZoneInfo.ConvertTime(item.StartsAtUtc, timeZone);
            var localEnd = TimeZoneInfo.ConvertTime(item.EndsAtUtc, timeZone);
            var hasConflict = item.CourtName is not null &&
                courtIdsByName.TryGetValue(item.CourtName, out var courtId) &&
                dayBookings.Any(booking =>
                    booking.CourtId == courtId &&
                    booking.StartsAtUtc < item.EndsAtUtc &&
                    booking.EndsAtUtc > item.StartsAtUtc);
            return new AdminTodayCoachOperationResponse(
                item.Id,
                $"{localStart:HH:mm} - {localEnd:HH:mm}",
                item.CourtName ?? "Chưa xếp sân",
                item.CoachName,
                (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours,
                item.IsCompleted ? "completed" :
                    localStart <= localNow ? "inProgress" : "upcoming",
                hasConflict);
        }).ToArray();

        var bookingRows = dayBookings
            .Where(item => item.EndsAtUtc > DateTimeOffset.UtcNow)
            .OrderBy(item => item.StartsAtUtc)
            .Select(item =>
            {
                var start = TimeZoneInfo.ConvertTime(item.StartsAtUtc, timeZone);
                var end = TimeZoneInfo.ConvertTime(item.EndsAtUtc, timeZone);
                return new AdminDashboardBookingResponse(
                    item.Id,
                    courts.FirstOrDefault(court => court.Id == item.CourtId)?.Name ?? "Sân",
                    item.CustomerName,
                    $"{start:HH:mm} - {end:HH:mm}",
                    ResolveBookingStatus(item, localNow));
            }).ToArray();
        var occupiedCourtCount = dayBookings
            .Where(item => item.StartsAtUtc <= DateTimeOffset.UtcNow && item.EndsAtUtc > DateTimeOffset.UtcNow)
            .Select(item => item.CourtId)
            .Distinct()
            .Count();
        var bookingConflictCount = dayBookings
            .GroupBy(item => item.CourtId)
            .Sum(group =>
            {
                var ordered = group.OrderBy(item => item.StartsAtUtc).ToArray();
                return ordered.SelectMany((left, index) => ordered.Skip(index + 1)
                    .Where(right => left.StartsAtUtc < right.EndsAtUtc && left.EndsAtUtc > right.StartsAtUtc))
                    .Count();
            });

        var response = new AdminDashboardResponse(
            "Chủ sân VNS PickleTrack",
            localToday.ToString("dd/MM/yyyy"),
            operationRows.Length,
            operationRows.Count(item => item.HasConflict) + bookingConflictCount,
            monthUsageHours,
            operationRows,
            courts.Count,
            Math.Max(0, courts.Count - occupiedCourtCount),
            occupiedCourtCount,
            bookingRows.Length,
            memberRows.Count(item => item.Status == "expiring"),
            lowStockCount,
            bookingRows);

        return Results.Ok(ApiEnvelope<AdminDashboardResponse>.Ok(response));
    }

    private static async Task<IResult> GetMembersAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var members = await BuildMemberRowsAsync(dbContext, cancellationToken);
        return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminMemberResponse>>.Ok(members));
    }

    private static async Task<IResult> GetCourtsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var now = DateTimeOffset.UtcNow;
        var courts = await dbContext.Courts.AsNoTracking()
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var courtIds = courts.Select(item => item.Id).ToArray();
        var bookingStats = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => courtIds.Contains(item.CourtId))
            .GroupBy(item => item.CourtId)
            .Select(group => new
            {
                CourtId = group.Key,
                BookingCount = group.Count(),
                FutureBookingCount = group.Count(item =>
                    item.Status != "cancelled" &&
                    item.EndsAtUtc > now),
                IsInUse = group.Any(item =>
                    item.Status != "cancelled" &&
                    item.StartsAtUtc <= now &&
                    item.EndsAtUtc > now)
            })
            .ToDictionaryAsync(item => item.CourtId, cancellationToken);
        var scheduleStats = await dbContext.CourtScheduleEntries.AsNoTracking()
            .Where(item => courtIds.Contains(item.CourtId))
            .GroupBy(item => item.CourtId)
            .Select(group => new
            {
                CourtId = group.Key,
                ScheduleCount = group.Count(),
                FutureScheduleCount = group.Count(item =>
                    item.Status != "cancelled" &&
                    item.EndsAtUtc > now),
                IsInUse = group.Any(item =>
                    item.Status != "cancelled" &&
                    item.StartsAtUtc <= now &&
                    item.EndsAtUtc > now)
            })
            .ToDictionaryAsync(item => item.CourtId, cancellationToken);
        var classCounts = await dbContext.Classes.AsNoTracking()
            .Where(item => item.CourtId != null && courtIds.Contains(item.CourtId.Value))
            .GroupBy(item => item.CourtId!.Value)
            .Select(group => new { CourtId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.CourtId, item => item.Count, cancellationToken);
        var priceRuleCounts = await dbContext.CourtPriceRules.AsNoTracking()
            .Where(item => courtIds.Contains(item.CourtId))
            .GroupBy(item => item.CourtId)
            .Select(group => new { CourtId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.CourtId, item => item.Count, cancellationToken);
        var priceRules = await dbContext.CourtPriceRules.AsNoTracking()
            .Where(item => courtIds.Contains(item.CourtId))
            .OrderBy(item => item.CourtId)
            .ThenBy(item => item.PriceType)
            .ThenBy(item => item.StartTime)
            .ToListAsync(cancellationToken);
        var priceRulesByCourt = priceRules
            .GroupBy(item => item.CourtId)
            .ToDictionary(
                group => group.Key,
                group => group.Select(rule => ToCourtPriceRuleResponse(rule, string.Empty)).ToArray());

        var responses = courts.Select(court =>
        {
            bookingStats.TryGetValue(court.Id, out var booking);
            scheduleStats.TryGetValue(court.Id, out var schedule);
            classCounts.TryGetValue(court.Id, out var classCount);
            priceRuleCounts.TryGetValue(court.Id, out var priceRuleCount);
            var bookingCount = booking?.BookingCount ?? 0;
            var scheduleCount = schedule?.ScheduleCount ?? 0;
            var futureBookingCount = booking?.FutureBookingCount ?? 0;
            var futureScheduleCount = schedule?.FutureScheduleCount ?? 0;
            var hasUsage = bookingCount + scheduleCount + classCount + priceRuleCount > 0;
            var isInUse = booking?.IsInUse == true || schedule?.IsInUse == true;
            var status = isInUse ? "inUse" : court.OperationalStatus;
            priceRulesByCourt.TryGetValue(court.Id, out var courtPriceRules);
            return new AdminCourtManagementResponse(
                court.Id,
                court.Name,
                court.CourtType,
                court.Surface,
                court.Description,
                court.Capacity,
                court.OpensAt.ToString("HH:mm"),
                court.ClosesAt.ToString("HH:mm"),
                court.HourlyRate,
                status,
                court.IsActive,
                bookingCount,
                scheduleCount,
                classCount,
                priceRuleCount,
                futureBookingCount,
                futureScheduleCount,
                !hasUsage,
                futureBookingCount == 0 && futureScheduleCount == 0,
                courtPriceRules ?? []);
        }).ToArray();

        return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminCourtManagementResponse>>.Ok(responses));
    }

    private static async Task<IResult> CreateCourtAsync(
        UpsertCourtRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!TryReadCourtRequest(request, out var opensAt, out var closesAt, out var error))
        {
            return Results.BadRequest(error);
        }

        if (await dbContext.Courts.AnyAsync(
                item => item.Name.ToLower() == request.Name.Trim().ToLower(),
                cancellationToken))
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Tên sân đã tồn tại.",
                new ApiError("COURT_DUPLICATE", "name", "Vui lòng dùng tên sân khác.")));
        }

        var court = new Court(
            request.Name.Trim(),
            string.IsNullOrWhiteSpace(request.Surface) ? "Acrylic" : request.Surface.Trim(),
            request.HourlyRate);
        court.UpdateDetails(
            request.Name,
            request.CourtType,
            request.Surface,
            request.Description ?? string.Empty,
            request.Capacity,
            opensAt,
            closesAt,
            request.HourlyRate);
        court.SetOperationalStatus(request.Status);
        await dbContext.Courts.AddAsync(court, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Created(
            $"{ApiRoutes.Root}/admin/courts/{court.Id}",
            ApiEnvelope<object>.Ok(new { court.Id }, "Đã tạo sân."));
    }

    private static async Task<IResult> UpdateCourtAsync(
        Guid id,
        UpsertCourtRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!TryReadCourtRequest(request, out var opensAt, out var closesAt, out var error))
        {
            return Results.BadRequest(error);
        }

        var court = await dbContext.Courts.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (court is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy sân.",
                new ApiError("COURT_NOT_FOUND", "id", "Sân không tồn tại.")));
        }

        if (await dbContext.Courts.AnyAsync(
                item => item.Id != id &&
                    item.Name.ToLower() == request.Name.Trim().ToLower(),
                cancellationToken))
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Tên sân đã tồn tại.",
                new ApiError("COURT_DUPLICATE", "name", "Vui lòng dùng tên sân khác.")));
        }

        court.UpdateDetails(
            request.Name,
            request.CourtType,
            request.Surface,
            request.Description ?? string.Empty,
            request.Capacity,
            opensAt,
            closesAt,
            request.HourlyRate);
        if (request.Status != court.OperationalStatus)
        {
            var guard = await EnsureCourtCanChangeAvailabilityAsync(
                dbContext,
                id,
                request.Status,
                cancellationToken);
            if (guard is not null)
            {
                return guard;
            }

            court.SetOperationalStatus(request.Status);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { court.Id }, "Đã cập nhật sân."));
    }

    private static async Task<IResult> SetCourtStatusAsync(
        Guid id,
        SetCourtStatusRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Status is not ("available" or "maintenance" or "paused" or "inactive"))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Trạng thái sân không hợp lệ.",
                new ApiError("INVALID_COURT_STATUS", "status", "Chỉ hỗ trợ available, maintenance, paused hoặc inactive.")));
        }

        var guard = await EnsureCourtCanChangeAvailabilityAsync(
            dbContext,
            id,
            request.Status,
            cancellationToken);
        if (guard is not null)
        {
            return guard;
        }

        var court = await dbContext.Courts.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (court is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy sân.",
                new ApiError("COURT_NOT_FOUND", "id", "Sân không tồn tại.")));
        }

        court.SetOperationalStatus(request.Status);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { court.Id, Status = court.OperationalStatus }, "Đã cập nhật trạng thái sân."));
    }

    private static async Task<IResult> DeleteCourtAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var court = await dbContext.Courts.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (court is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy sân.",
                new ApiError("COURT_NOT_FOUND", "id", "Sân không tồn tại.")));
        }

        var hasUsage =
            await dbContext.CourtBookings.AnyAsync(item => item.CourtId == id, cancellationToken) ||
            await dbContext.CourtScheduleEntries.AnyAsync(item => item.CourtId == id, cancellationToken) ||
            await dbContext.Classes.AnyAsync(item => item.CourtId == id, cancellationToken) ||
            await dbContext.CourtPriceRules.AnyAsync(item => item.CourtId == id, cancellationToken);

        if (hasUsage)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Sân đã phát sinh dữ liệu nên không thể xóa cứng.",
                new ApiError("COURT_HAS_USAGE", "id", "Hãy chuyển sân sang tạm ngừng hoặc ngừng hoạt động để giữ lịch sử.")));
        }

        dbContext.Courts.Remove(court);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IResult> GetCourtOperationsAsync(
        string? date,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var localToday = DateOnly.FromDateTime(localNow.Date);
        var selectedDate = localToday;

        if (!string.IsNullOrWhiteSpace(date) &&
            !DateOnly.TryParseExact(date, "yyyy-MM-dd", out selectedDate))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Ngày lịch sân không hợp lệ.",
                new ApiError("INVALID_DATE", "date", "Ngày phải theo định dạng yyyy-MM-dd.")));
        }

        var dayStartLocal = selectedDate.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified);
        var dayEndLocal = selectedDate.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified);
        var dayStartUtc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(dayStartLocal, timeZone));
        var dayEndUtc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(dayEndLocal, timeZone));

        var courts = await dbContext.Courts
            .AsNoTracking()
            .Where(item => item.IsActive)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var activeCourtIds = courts.Select(item => item.Id).ToArray();
        var bookings = await dbContext.CourtBookings
            .AsNoTracking()
            .Where(item => item.StartsAtUtc < dayEndUtc && item.EndsAtUtc > dayStartUtc)
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var classes = await dbContext.Classes
            .AsNoTracking()
            .Where(item => item.IsActive && (item.CourtId != null || item.CourtName != null))
            .ToListAsync(cancellationToken);
        var classIds = classes.Select(item => item.Id).ToArray();
        var sessions = await dbContext.Sessions
            .AsNoTracking()
            .Where(item =>
                classIds.Contains(item.ClassId) &&
                item.StartsAtUtc < dayEndUtc &&
                item.EndsAtUtc > dayStartUtc)
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var operationalEntries = await dbContext.CourtScheduleEntries
            .AsNoTracking()
            .Where(item =>
                activeCourtIds.Contains(item.CourtId) &&
                item.StartsAtUtc < dayEndUtc &&
                item.EndsAtUtc > dayStartUtc)
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var coaches = await dbContext.Coaches
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id, cancellationToken);
        var courtsByName = courts.ToDictionary(
            item => item.Name,
            StringComparer.OrdinalIgnoreCase);
        var classesById = classes.ToDictionary(item => item.Id);
        var bookingsByCourt = bookings
            .GroupBy(item => item.CourtId)
            .ToDictionary(group => group.Key, group => group.ToArray());
        var sessionsByCourt = sessions
            .Select(session =>
            {
                var trainingClass = classesById[session.ClassId];
                var courtId = trainingClass.CourtId;
                if (courtId is null &&
                    trainingClass.CourtName is not null &&
                    courtsByName.TryGetValue(trainingClass.CourtName, out var mappedCourt))
                {
                    courtId = mappedCourt.Id;
                }

                return new { Session = session, TrainingClass = trainingClass, CourtId = courtId };
            })
            .Where(item => item.CourtId.HasValue)
            .GroupBy(item => item.CourtId!.Value)
            .ToDictionary(group => group.Key, group => group.ToArray());
        var entriesByCourt = operationalEntries
            .GroupBy(item => item.CourtId)
            .ToDictionary(group => group.Key, group => group.ToArray());

        var courtRows = courts.Select(court =>
        {
            var courtBookings = bookingsByCourt.GetValueOrDefault(court.Id) ?? [];
            var courtSessions = sessionsByCourt.GetValueOrDefault(court.Id) ?? [];
            var courtEntries = entriesByCourt.GetValueOrDefault(court.Id) ?? [];
            var activeBooking = courtBookings.FirstOrDefault(item =>
                item.StartsAtUtc <= DateTimeOffset.UtcNow &&
                item.EndsAtUtc > DateTimeOffset.UtcNow &&
                item.Status != "cancelled");
            var activeSession = courtSessions.FirstOrDefault(item =>
                item.Session.StartsAtUtc <= DateTimeOffset.UtcNow &&
                item.Session.EndsAtUtc > DateTimeOffset.UtcNow &&
                !item.Session.IsCancelled);
            var activeEntry = courtEntries.FirstOrDefault(item =>
                item.StartsAtUtc <= DateTimeOffset.UtcNow &&
                item.EndsAtUtc > DateTimeOffset.UtcNow &&
                item.Status != "cancelled");
            var nextBooking = courtBookings.FirstOrDefault(item =>
                item.StartsAtUtc > DateTimeOffset.UtcNow &&
                item.Status != "cancelled");
            var nextSession = courtSessions.FirstOrDefault(item =>
                item.Session.StartsAtUtc > DateTimeOffset.UtcNow &&
                !item.Session.IsCancelled);
            var nextEntry = courtEntries.FirstOrDefault(item =>
                item.StartsAtUtc > DateTimeOffset.UtcNow &&
                item.Status != "cancelled");
            var activeEnd = new[]
                {
                    activeBooking?.EndsAtUtc,
                    activeSession?.Session.EndsAtUtc,
                    activeEntry?.EndsAtUtc
                }
                .Where(item => item.HasValue)
                .Min();
            var nextStart = new[]
                {
                    nextBooking?.StartsAtUtc,
                    nextSession?.Session.StartsAtUtc,
                    nextEntry?.StartsAtUtc
                }
                .Where(item => item.HasValue)
                .Min();

            var status = !court.IsBookable ? court.OperationalStatus :
                activeEnd.HasValue ? "occupied" :
                nextStart.HasValue ? "reserved" : "available";

            return new AdminCourtResponse(
                court.Id,
                court.Name,
                court.Surface,
                court.HourlyRate,
                status,
                activeEnd.HasValue
                    ? TimeZoneInfo.ConvertTime(activeEnd.Value, timeZone).ToString("HH:mm")
                    : nextStart.HasValue
                        ? TimeZoneInfo.ConvertTime(nextStart.Value, timeZone).ToString("HH:mm")
                        : null);
        }).ToArray();
        var bookingRows = bookings.Select(booking =>
        {
            var court = courts.First(item => item.Id == booking.CourtId);
            var localStart = TimeZoneInfo.ConvertTime(booking.StartsAtUtc, timeZone);
            var localEnd = TimeZoneInfo.ConvertTime(booking.EndsAtUtc, timeZone);
            return new AdminCourtBookingResponse(
                booking.Id,
                booking.BookingCode,
                booking.CourtId,
                court.Name,
                booking.CustomerName,
                booking.CustomerPhone,
                booking.CustomerType,
                selectedDate.ToString("yyyy-MM-dd"),
                localStart.ToString("HH:mm"),
                localEnd.ToString("HH:mm"),
                $"{localStart:HH:mm} - {localEnd:HH:mm}",
                booking.Amount,
                ResolveBookingStatus(booking, localNow));
        }).ToArray();
        var sessionRows = sessions
            .Select(session =>
            {
                var trainingClass = classesById[session.ClassId];
                var court = trainingClass.CourtId.HasValue
                    ? courts.FirstOrDefault(item => item.Id == trainingClass.CourtId.Value)
                    : trainingClass.CourtName is not null &&
                        courtsByName.TryGetValue(trainingClass.CourtName, out var mappedCourt)
                        ? mappedCourt
                        : null;
                if (court is null)
                {
                    return null;
                }

                var localStart = TimeZoneInfo.ConvertTime(session.StartsAtUtc, timeZone);
                var localEnd = TimeZoneInfo.ConvertTime(session.EndsAtUtc, timeZone);
                var coachName = coaches.GetValueOrDefault(trainingClass.CoachId)?.FullName
                    ?? "HLV chưa xác định";
                var status = session.IsCancelled ? "cancelled" :
                    session.IsCompleted || session.EndsAtUtc <= DateTimeOffset.UtcNow ? "completed" :
                    session.StartsAtUtc <= DateTimeOffset.UtcNow ? "playing" : "confirmed";

                return new AdminCourtScheduleItemResponse(
                    session.Id,
                    "classSession",
                    session.Id,
                    court.Id,
                    court.Name,
                    coachName,
                    trainingClass.Name,
                    selectedDate.ToString("yyyy-MM-dd"),
                    localStart.ToString("HH:mm"),
                    localEnd.ToString("HH:mm"),
                    $"{localStart:HH:mm} - {localEnd:HH:mm}",
                    status,
                    "Lớp học",
                    $"coach-session:{session.Id}");
            })
            .Where(item => item is not null)
            .Select(item => item!)
            .ToArray();
        var scheduleItems = bookingRows
            .Select(item => new AdminCourtScheduleItemResponse(
                item.Id,
                "booking",
                item.Id,
                item.CourtId,
                item.CourtName,
                item.CustomerName,
                "Đặt sân",
                item.Date,
                item.StartTime,
                item.EndTime,
                item.TimeRange,
                item.Status,
                "Booking",
                $"booking:{item.Id}"))
            .Concat(sessionRows)
            .Concat(operationalEntries.Select(item =>
            {
                var court = courts.First(row => row.Id == item.CourtId);
                var localStart = TimeZoneInfo.ConvertTime(item.StartsAtUtc, timeZone);
                var localEnd = TimeZoneInfo.ConvertTime(item.EndsAtUtc, timeZone);
                return new AdminCourtScheduleItemResponse(
                    item.Id,
                    item.ScheduleType,
                    item.Id,
                    item.CourtId,
                    court.Name,
                    item.OwnerName,
                    item.Purpose,
                    selectedDate.ToString("yyyy-MM-dd"),
                    localStart.ToString("HH:mm"),
                    localEnd.ToString("HH:mm"),
                    $"{localStart:HH:mm} - {localEnd:HH:mm}",
                    item.Status,
                    CourtScheduleTypeLabel(item.ScheduleType),
                    $"court-schedule:{item.Id}");
            }))
            .OrderBy(item => item.StartTime)
            .ThenBy(item => item.CourtName)
            .ToArray();

        var response = new AdminCourtOperationsResponse(
            selectedDate.ToString("yyyy-MM-dd"),
            selectedDate.ToString("dd/MM/yyyy"),
            courtRows.Length,
            courtRows.Count(item => item.Status == "available"),
            bookingRows.Length,
            bookingRows.Sum(item => item.Amount),
            courtRows,
            bookingRows,
            scheduleItems);

        return Results.Ok(ApiEnvelope<AdminCourtOperationsResponse>.Ok(response));
    }

    private static async Task<IResult> CreateCourtScheduleItemAsync(
        CreateCourtScheduleItemRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var allowedTypes = new[] { "personal", "event", "maintenance", "blocked" };
        if (!allowedTypes.Contains(request.ScheduleType) ||
            string.IsNullOrWhiteSpace(request.Purpose) ||
            !DateOnly.TryParseExact(request.Date, "yyyy-MM-dd", out var date) ||
            !TimeOnly.TryParseExact(request.StartTime, "HH:mm", out var startTime) ||
            !TimeOnly.TryParseExact(request.EndTime, "HH:mm", out var endTime) ||
            endTime <= startTime)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Loại lịch hoặc khung giờ không hợp lệ.",
                new ApiError("INVALID_COURT_SCHEDULE", null, "Kiểm tra loại lịch, ngày và giờ sử dụng sân.")));
        }

        var court = await dbContext.Courts.SingleOrDefaultAsync(
            item => item.Id == request.CourtId,
            cancellationToken);
        if (court is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy sân.",
                new ApiError("COURT_NOT_FOUND", "courtId", "Sân không tồn tại hoặc đã ngưng hoạt động.")));
        }

        if (!court.IsBookable)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Sân không khả dụng để tạo lịch.",
                new ApiError("COURT_NOT_BOOKABLE", "courtId", "Sân đang bảo trì, tạm ngừng hoặc ngừng hoạt động.")));
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var startsAtUtc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(
            date.ToDateTime(startTime, DateTimeKind.Unspecified), timeZone));
        var endsAtUtc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(
            date.ToDateTime(endTime, DateTimeKind.Unspecified), timeZone));

        if (startTime < court.OpensAt || endTime > court.ClosesAt)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Khung giờ nằm ngoài giờ hoạt động của sân.",
                new ApiError(
                    "OUTSIDE_COURT_HOURS",
                    "startTime",
                    $"Sân chỉ hoạt động từ {court.OpensAt:HH:mm} đến {court.ClosesAt:HH:mm}.")));
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.Serializable,
            cancellationToken);
        if (await HasCourtScheduleOverlapAsync(
                dbContext,
                court,
                startsAtUtc,
                endsAtUtc,
                null,
                cancellationToken))
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Khung giờ này đã có lịch trên sân.",
                new ApiError("COURT_SCHEDULE_OVERLAP", "startTime", "Vui lòng chọn sân hoặc khung giờ khác.")));
        }

        var entry = new CourtScheduleEntry(
            court.Id,
            request.ScheduleType,
            string.IsNullOrWhiteSpace(request.OwnerName) ? "Chủ sân" : request.OwnerName.Trim(),
            request.Purpose.Trim(),
            startsAtUtc,
            endsAtUtc,
            request.Status == "cancelled"
                ? "cancelled"
                : request.ScheduleType is "maintenance" or "blocked"
                    ? "maintenance"
                    : "confirmed");
        await dbContext.CourtScheduleEntries.AddAsync(entry, cancellationToken);
        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Không thể tạo lịch do lịch sân vừa thay đổi.",
                new ApiError("COURT_SCHEDULE_CONFLICT", "startTime", "Hãy tải lại lịch và chọn khung giờ khác.")));
        }
        catch (PostgresException exception)
            when (exception.SqlState == PostgresErrorCodes.SerializationFailure)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Không thể tạo lịch do lịch sân vừa thay đổi.",
                new ApiError("COURT_SCHEDULE_CONFLICT", "startTime", "Hãy tải lại lịch và chọn khung giờ khác.")));
        }

        return Results.Created(
            $"{ApiRoutes.Root}/admin/court-schedule-items/{entry.Id}",
            ApiEnvelope<object>.Ok(new { entry.Id }, "Đã tạo lịch sử dụng sân."));
    }

    private static async Task<IResult> CreateCourtBookingAsync(
        CreateCourtBookingRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!DateOnly.TryParseExact(request.Date, "yyyy-MM-dd", out var date) ||
            !TimeOnly.TryParseExact(request.StartTime, "HH:mm", out var startTime) ||
            !TimeOnly.TryParseExact(request.EndTime, "HH:mm", out var endTime))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Ngày hoặc khung giờ không hợp lệ.",
                new ApiError(
                    "INVALID_BOOKING_TIME",
                    "date",
                    "Dùng định dạng ngày yyyy-MM-dd và giờ HH:mm.")));
        }

        if (string.IsNullOrWhiteSpace(request.CustomerName) ||
            string.IsNullOrWhiteSpace(request.CustomerPhone))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Thiếu thông tin khách đặt sân.",
                new ApiError(
                    "REQUIRED_CUSTOMER",
                    "customerName",
                    "Tên và số điện thoại khách hàng là bắt buộc.")));
        }

        var localStart = date.ToDateTime(startTime, DateTimeKind.Unspecified);
        var localEnd = date.ToDateTime(endTime, DateTimeKind.Unspecified);
        var duration = localEnd - localStart;

        if (duration < TimeSpan.FromMinutes(30) ||
            duration.TotalMinutes % 30 != 0 ||
            startTime < new TimeOnly(5, 0) ||
            endTime > new TimeOnly(23, 0))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Khung giờ booking không hợp lệ.",
                new ApiError(
                    "INVALID_DURATION",
                    "endTime",
                    "Booking tối thiểu 30 phút, theo bước 30 phút và trong 05:00-23:00.")));
        }

        var court = await dbContext.Courts
            .SingleOrDefaultAsync(
                item => item.Id == request.CourtId,
                cancellationToken);
        if (court is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy sân.",
                new ApiError("COURT_NOT_FOUND", "courtId", "Sân không tồn tại hoặc đã ngưng hoạt động.")));
        }

        if (!court.IsBookable)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Sân không khả dụng để tạo booking.",
                new ApiError("COURT_NOT_BOOKABLE", "courtId", "Sân đang bảo trì, tạm ngừng hoặc ngừng hoạt động.")));
        }

        if (startTime < court.OpensAt || endTime > court.ClosesAt)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Khung giờ nằm ngoài giờ hoạt động của sân.",
                new ApiError(
                    "OUTSIDE_COURT_HOURS",
                    "startTime",
                    $"Sân chỉ hoạt động từ {court.OpensAt:HH:mm} đến {court.ClosesAt:HH:mm}.")));
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var startsAtUtc = new DateTimeOffset(
            TimeZoneInfo.ConvertTimeToUtc(localStart, timeZone));
        var endsAtUtc = new DateTimeOffset(
            TimeZoneInfo.ConvertTimeToUtc(localEnd, timeZone));
        if (startsAtUtc < DateTimeOffset.UtcNow)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Không thể tạo booking trong quá khứ.",
                new ApiError(
                    "BOOKING_IN_PAST",
                    "startTime",
                    "Ngày và giờ bắt đầu phải từ thời điểm hiện tại trở đi.")));
        }
        var status = request.Status is "pending" or "confirmed"
            ? request.Status
            : "pending";

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.Serializable,
            cancellationToken);
        if (await HasCourtScheduleOverlapAsync(
                dbContext,
                court,
                startsAtUtc,
                endsAtUtc,
                null,
                cancellationToken))
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Khung giờ này đã có lịch trên sân.",
                new ApiError(
                    "BOOKING_OVERLAP",
                    "startTime",
                    "Vui lòng chọn sân hoặc khung giờ khác.")));
        }

        var hourlyRate = await ResolveCourtRateAsync(
            dbContext,
            court,
            date,
            startTime,
            request.CustomerType,
            cancellationToken);
        var grossCourtAmount = hourlyRate * (decimal)duration.TotalHours;
        var booking = new CourtBooking(
            court.Id,
            request.CustomerName.Trim(),
            request.CustomerPhone.Trim(),
            startsAtUtc,
            endsAtUtc,
            grossCourtAmount,
            status,
            request.CustomerType is "member" or "student" or "coach" ? request.CustomerType : "guest");

        if (request.CustomerType == "member")
        {
            var member = await dbContext.Members.SingleOrDefaultAsync(
                item => item.IsActive && item.PhoneNumber == request.CustomerPhone.Trim(),
                cancellationToken);
            if (member is not null)
            {
                var renewals = await dbContext.PaymentRenewals
                    .Where(item =>
                        item.MemberId == member.Id &&
                        item.PaymentStatus == "paid" &&
                        item.ActivatedAtUtc <= startsAtUtc &&
                        item.ExpiresAtUtc >= startsAtUtc &&
                        item.FreeCourtUsesGranted > item.FreeCourtUsesUsed)
                    .OrderBy(item => item.ExpiresAtUtc)
                    .ToListAsync(cancellationToken);
                var packageIds = renewals.Select(item => item.PackageId).Distinct().ToArray();
                var packages = await dbContext.Packages
                    .Where(item => packageIds.Contains(item.Id))
                    .ToDictionaryAsync(item => item.Id, cancellationToken);
                var eligibleRenewal = renewals.FirstOrDefault(item =>
                    packages.TryGetValue(item.PackageId, out var package) &&
                    package.IncludesFreeCourt &&
                    duration.TotalMinutes <= package.FreeCourtMinutesPerUse);

                if (eligibleRenewal is not null &&
                    packages.TryGetValue(eligibleRenewal.PackageId, out var eligiblePackage) &&
                    eligibleRenewal.TryUseFreeCourt(startsAtUtc))
                {
                    booking.ApplyMembershipCourtBenefit(
                        member.Id,
                        eligibleRenewal.Id,
                        grossCourtAmount,
                        eligiblePackage.Name,
                        eligibleRenewal.ExpiresAtUtc,
                        eligibleRenewal.FreeCourtUsesRemaining,
                        $"Miễn tiền sân theo gói {eligiblePackage.Name}; còn {eligibleRenewal.FreeCourtUsesRemaining} lượt sau booking này.");
                }
            }
        }
        await dbContext.CourtBookings.AddAsync(booking, cancellationToken);
        if (booking.Amount > 0)
        {
            await dbContext.FinanceDebts.AddAsync(new FinanceDebt(
            "receivable",
            booking.CustomerName,
            $"Hóa đơn booking BK-{booking.Id.ToString()[..8].ToUpperInvariant()}",
            booking.Amount,
            0,
            booking.EndsAtUtc.AddDays(7),
            "courtBooking",
            booking.Id,
                request.CustomerType is "member" or "coach" ? request.CustomerType : "booking"), cancellationToken);
        }

        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Không thể tạo booking do lịch sân vừa thay đổi.",
                new ApiError(
                    "BOOKING_CONFLICT",
                    "startTime",
                    "Hãy tải lại lịch và chọn khung giờ khác.")));
        }
        catch (PostgresException exception)
            when (exception.SqlState == PostgresErrorCodes.SerializationFailure)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Không thể tạo booking do lịch sân vừa thay đổi.",
                new ApiError(
                    "BOOKING_CONFLICT",
                    "startTime",
                    "Hãy tải lại lịch và chọn khung giờ khác.")));
        }

        return Results.Created(
            $"{ApiRoutes.Root}/admin/court-bookings/{booking.Id}",
            ApiEnvelope<AdminCourtBookingResponse>.Ok(
                new AdminCourtBookingResponse(
                    booking.Id,
                    booking.BookingCode,
                    booking.CourtId,
                    court.Name,
                    booking.CustomerName,
                    booking.CustomerPhone,
                    booking.CustomerType,
                    date.ToString("yyyy-MM-dd"),
                    startTime.ToString("HH:mm"),
                    endTime.ToString("HH:mm"),
                    $"{startTime:HH:mm} - {endTime:HH:mm}",
                    booking.Amount,
                    booking.Status),
                "Đã tạo booking."));
    }

    private static async Task<IResult> GetCourtBookingAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var row = await (
            from booking in dbContext.CourtBookings.AsNoTracking()
            join court in dbContext.Courts.AsNoTracking() on booking.CourtId equals court.Id
            where booking.Id == id
            select new { Booking = booking, CourtName = court.Name })
            .SingleOrDefaultAsync(cancellationToken);
        if (row is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy booking.",
                new ApiError("BOOKING_NOT_FOUND", "id", "Booking không tồn tại.")));
        }

        var localStart = TimeZoneInfo.ConvertTime(row.Booking.StartsAtUtc, timeZone);
        var localEnd = TimeZoneInfo.ConvertTime(row.Booking.EndsAtUtc, timeZone);
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        return Results.Ok(ApiEnvelope<AdminCourtBookingResponse>.Ok(
            new AdminCourtBookingResponse(
                row.Booking.Id,
                row.Booking.BookingCode,
                row.Booking.CourtId,
                row.CourtName,
                row.Booking.CustomerName,
                row.Booking.CustomerPhone,
                row.Booking.CustomerType,
                localStart.ToString("yyyy-MM-dd"),
                localStart.ToString("HH:mm"),
                localEnd.ToString("HH:mm"),
                $"{localStart:HH:mm} - {localEnd:HH:mm}",
                row.Booking.Amount,
                ResolveBookingStatus(row.Booking, localNow))));
    }

    private static async Task<bool> HasCourtScheduleOverlapAsync(
        PickleTrackDbContext dbContext,
        Court court,
        DateTimeOffset startsAtUtc,
        DateTimeOffset endsAtUtc,
        Guid? excludedBookingId,
        CancellationToken cancellationToken)
    {
        if (await dbContext.CourtBookings.AnyAsync(
                item =>
                    item.Id != excludedBookingId &&
                    item.CourtId == court.Id &&
                    item.Status != "cancelled" &&
                    item.StartsAtUtc < endsAtUtc &&
                    item.EndsAtUtc > startsAtUtc,
                cancellationToken))
        {
            return true;
        }

        if (await dbContext.CourtScheduleEntries.AnyAsync(
                item =>
                    item.CourtId == court.Id &&
                    item.Status != "cancelled" &&
                    item.StartsAtUtc < endsAtUtc &&
                    item.EndsAtUtc > startsAtUtc,
                cancellationToken))
        {
            return true;
        }

        var courtClassIds = await dbContext.Classes
            .Where(item =>
                item.IsActive &&
                (item.CourtId == court.Id ||
                    (item.CourtId == null &&
                        item.CourtName != null &&
                        item.CourtName.ToLower() == court.Name.ToLower())))
            .Select(item => item.Id)
            .ToArrayAsync(cancellationToken);

        return await dbContext.Sessions.AnyAsync(
            item =>
                courtClassIds.Contains(item.ClassId) &&
                !item.IsCancelled &&
                item.StartsAtUtc < endsAtUtc &&
                item.EndsAtUtc > startsAtUtc,
            cancellationToken);
    }

    private static string CourtScheduleTypeLabel(string scheduleType) =>
        scheduleType switch
        {
            "personal" => "Lịch cá nhân",
            "event" => "Sự kiện",
            "maintenance" => "Bảo trì",
            "blocked" => "Khóa sân",
            _ => "Lịch vận hành"
        };

    private static string ResolveBookingStatus(
        CourtBooking booking,
        DateTimeOffset localNow)
    {
        if (booking.Status is "cancelled" or "maintenance" or "completed")
        {
            return booking.Status;
        }

        if (booking.EndsAtUtc <= localNow.ToUniversalTime())
        {
            return "completed";
        }

        if (booking.StartsAtUtc <= localNow.ToUniversalTime() &&
            booking.EndsAtUtc > localNow.ToUniversalTime() &&
            booking.Status is "checkedIn" or "confirmed")
        {
            return "playing";
        }

        return booking.Status;
    }

    private static bool TryReadCourtRequest(
        UpsertCourtRequest request,
        out TimeOnly opensAt,
        out TimeOnly closesAt,
        out ApiEnvelope<object> error)
    {
        opensAt = default;
        closesAt = default;
        error = ApiEnvelope<object>.Ok(new { });

        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.CourtType) ||
            string.IsNullOrWhiteSpace(request.Surface) ||
            !TimeOnly.TryParseExact(request.OpensAt, "HH:mm", out opensAt) ||
            !TimeOnly.TryParseExact(request.ClosesAt, "HH:mm", out closesAt) ||
            opensAt >= closesAt ||
            request.Capacity <= 0 ||
            request.HourlyRate < 0 ||
            request.Status is not ("available" or "maintenance" or "paused" or "inactive"))
        {
            error = ApiEnvelope<object>.Fail(
                "Thông tin sân không hợp lệ.",
                new ApiError(
                    "INVALID_COURT",
                    null,
                    "Kiểm tra tên sân, loại sân, mặt sân, sức chứa, giờ hoạt động, giá cơ bản và trạng thái."));
            return false;
        }

        return true;
    }

    private static async Task<IResult?> EnsureCourtCanChangeAvailabilityAsync(
        PickleTrackDbContext dbContext,
        Guid courtId,
        string nextStatus,
        CancellationToken cancellationToken)
    {
        if (nextStatus == "available")
        {
            return null;
        }

        var now = DateTimeOffset.UtcNow;
        var hasFutureBooking = await dbContext.CourtBookings.AsNoTracking()
            .AnyAsync(item =>
                item.CourtId == courtId &&
                item.Status != "cancelled" &&
                item.EndsAtUtc > now,
                cancellationToken);
        if (hasFutureBooking)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Không thể vô hiệu hóa sân khi còn booking tương lai.",
                new ApiError("COURT_HAS_FUTURE_BOOKINGS", "status", "Hãy xử lý, đổi sân hoặc hủy các booking tương lai trước.")));
        }

        var hasFutureSchedule = await dbContext.CourtScheduleEntries.AsNoTracking()
            .AnyAsync(item =>
                item.CourtId == courtId &&
                item.Status != "cancelled" &&
                item.EndsAtUtc > now,
                cancellationToken);
        if (hasFutureSchedule)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Không thể khóa sân khi còn lịch sử dụng tương lai.",
                new ApiError("COURT_HAS_FUTURE_SCHEDULES", "status", "Hãy xử lý lịch vận hành, lớp học hoặc lịch bảo trì tương lai trước.")));
        }

        var classIds = await dbContext.Classes.AsNoTracking()
            .Where(item => item.CourtId == courtId)
            .Select(item => item.Id)
            .ToArrayAsync(cancellationToken);
        var hasFutureSession = await dbContext.Sessions.AsNoTracking()
            .AnyAsync(item =>
                classIds.Contains(item.ClassId) &&
                !item.IsCancelled &&
                item.EndsAtUtc > now,
                cancellationToken);

        return hasFutureSession
            ? Results.Conflict(ApiEnvelope<object>.Fail(
                "Không thể khóa sân khi còn buổi học tương lai.",
                new ApiError("COURT_HAS_FUTURE_CLASSES", "status", "Hãy đổi sân hoặc hủy các buổi học tương lai trước.")))
            : null;
    }

    private static async Task<AdminMemberResponse[]> BuildMemberRowsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var members = await dbContext.Members
            .AsNoTracking()
            .OrderBy(item => item.FullName)
            .ToListAsync(cancellationToken);
        var payments = await dbContext.PaymentRenewals
            .AsNoTracking()
            .ToListAsync(cancellationToken);
        var attendance = await dbContext.AttendanceRecords
            .AsNoTracking()
            .ToListAsync(cancellationToken);
        var sessions = await dbContext.Sessions
            .AsNoTracking()
            .ToListAsync(cancellationToken);
        var classes = await dbContext.Classes
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id, cancellationToken);

        var sessionById = sessions.ToDictionary(item => item.Id);

        return members.Select(member =>
        {
            var memberPayments = payments.Where(item => item.MemberId == member.Id).ToArray();
            var memberAttendance = attendance
                .Where(item => item.MemberId == member.Id)
                .ToArray();
            var totalSessions = memberPayments.Sum(item => item.SessionsAdded);
            var attendedSessions = memberAttendance.Count(item => item.DeductsSession);
            var remainingSessions = Math.Max(0, totalSessions - attendedSessions);
            var latestClassId = memberAttendance
                .Select(item => sessionById.GetValueOrDefault(item.SessionId))
                .Where(item => item is not null)
                .OrderByDescending(item => item!.StartsAtUtc)
                .Select(item => item!.ClassId)
                .FirstOrDefault();
            var className = classes.GetValueOrDefault(latestClassId)?.Name
                ?? member.SkillLevel
                ?? "Chưa xếp lớp";
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
    }
}

public sealed record AdminDashboardResponse(
    string OwnerName,
    string LocalDate,
    int TodayCoachUsageCount,
    int CoachConflictCount,
    decimal MonthlyCoachUsageHours,
    IReadOnlyCollection<AdminTodayCoachOperationResponse> TodayCoachOperations,
    int CourtCount,
    int AvailableCourtCount,
    int OccupiedCourtCount,
    int TodayBookingCount,
    int ExpiringMemberCount,
    int LowStockCount,
    IReadOnlyCollection<AdminDashboardBookingResponse> UpcomingBookings);

public sealed record AdminDashboardBookingResponse(
    Guid Id,
    string CourtName,
    string CustomerName,
    string TimeRange,
    string Status);

public sealed record AdminTodayCoachOperationResponse(
    Guid Id,
    string TimeRange,
    string CourtName,
    string CoachName,
    decimal DurationHours,
    string Status,
    bool HasConflict);

public sealed record AdminMemberResponse(
    Guid Id,
    string Name,
    string Phone,
    string ClassName,
    int TotalSessions,
    int AttendedSessions,
    int RemainingSessions,
    string Status);

public sealed record AdminCourtOperationsResponse(
    string SelectedDate,
    string LocalDate,
    int CourtCount,
    int AvailableCourtCount,
    int BookingCount,
    decimal ExpectedRevenue,
    IReadOnlyCollection<AdminCourtResponse> Courts,
    IReadOnlyCollection<AdminCourtBookingResponse> Bookings,
    IReadOnlyCollection<AdminCourtScheduleItemResponse> ScheduleItems);

public sealed record AdminCourtManagementResponse(
    Guid Id,
    string Name,
    string CourtType,
    string Surface,
    string Description,
    int Capacity,
    string OpensAt,
    string ClosesAt,
    decimal HourlyRate,
    string Status,
    bool IsActive,
    int BookingCount,
    int ScheduleCount,
    int ClassCount,
    int PriceRuleCount,
    int FutureBookingCount,
    int FutureScheduleCount,
    bool CanDelete,
    bool CanDisable,
    IReadOnlyCollection<AdminCourtPriceRuleResponse> PriceRules);

public sealed record UpsertCourtRequest(
    string Name,
    string CourtType,
    string Surface,
    string? Description,
    int Capacity,
    string OpensAt,
    string ClosesAt,
    decimal HourlyRate,
    string Status);

public sealed record SetCourtStatusRequest(string Status);

public sealed record AdminCourtScheduleItemResponse(
    Guid Id,
    string SourceType,
    Guid SourceId,
    Guid CourtId,
    string CourtName,
    string OwnerName,
    string Purpose,
    string Date,
    string StartTime,
    string EndTime,
    string TimeRange,
    string Status,
    string ScheduleType,
    string DetailTarget);

public sealed record AdminCourtResponse(
    Guid Id,
    string Name,
    string Surface,
    decimal HourlyRate,
    string Status,
    string? NextChangeAt);

public sealed record AdminCourtBookingResponse(
    Guid Id,
    string BookingCode,
    Guid CourtId,
    string CourtName,
    string CustomerName,
    string CustomerPhone,
    string CustomerType,
    string Date,
    string StartTime,
    string EndTime,
    string TimeRange,
    decimal Amount,
    string Status);

public sealed record CreateCourtBookingRequest(
    Guid CourtId,
    string Date,
    string StartTime,
    string EndTime,
    string CustomerName,
    string CustomerPhone,
    string Status,
    string CustomerType = "guest");

public sealed record CreateCourtScheduleItemRequest(
    Guid CourtId,
    string ScheduleType,
    string OwnerName,
    string Purpose,
    string Date,
    string StartTime,
    string EndTime,
    string Status);
