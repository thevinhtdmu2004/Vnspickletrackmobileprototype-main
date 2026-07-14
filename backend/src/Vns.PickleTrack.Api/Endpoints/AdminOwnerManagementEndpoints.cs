using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Application.Routes;
using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static partial class AdminEndpoints
{
    private static async Task<decimal> ResolveCourtRateAsync(
        PickleTrackDbContext dbContext,
        Court court,
        DateOnly date,
        TimeOnly startTime,
        string? customerType,
        CancellationToken cancellationToken)
    {
        var type = customerType is "member" or "coach" ? customerType : "guest";
        var dayType = date.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday
            ? "weekend"
            : "weekday";
        var rules = await dbContext.CourtPriceRules
            .AsNoTracking()
            .Where(item =>
                item.CourtId == court.Id &&
                item.IsActive &&
                (item.CustomerType == type || item.CustomerType == "all") &&
                item.EffectiveFrom <= date)
            .OrderByDescending(item => item.EffectiveFrom)
            .ThenByDescending(item => item.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        var holiday = rules.FirstOrDefault(item =>
            item.PriceType == "holiday" &&
            SplitHolidayDates(item.HolidayDates).Contains(date));
        if (holiday is not null)
        {
            return holiday.HourlyRate;
        }

        var peak = rules.FirstOrDefault(item =>
            item.PriceType == "peak" &&
            (item.DayType == dayType || item.DayType == "all") &&
            item.StartTime <= startTime &&
            item.EndTime > startTime);
        if (peak is not null)
        {
            return peak.HourlyRate;
        }

        var regular = rules.FirstOrDefault(item =>
            item.PriceType == "regular" &&
            (item.DayType == dayType || item.DayType == "all") &&
            item.StartTime <= startTime &&
            item.EndTime > startTime);
        return regular?.HourlyRate ?? court.HourlyRate;
    }

    private static async Task<IResult> GetCourtPricingAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var courts = await dbContext.Courts.AsNoTracking()
            .Where(item => item.IsActive)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var rules = await dbContext.CourtPriceRules.AsNoTracking()
            .OrderByDescending(item => item.EffectiveFrom)
            .ThenBy(item => item.StartTime)
            .ToListAsync(cancellationToken);
        var names = courts.ToDictionary(item => item.Id, item => item.Name);

        return Results.Ok(ApiEnvelope<AdminCourtPricingResponse>.Ok(
            new AdminCourtPricingResponse(
                courts.Select(item => new AdminCourtPriceCourtResponse(
                    item.Id,
                    item.Name,
                    item.HourlyRate)).ToArray(),
                rules.Select(item => new AdminCourtPriceRuleResponse(
                    item.Id,
                    item.CourtId,
                    names.GetValueOrDefault(item.CourtId) ?? "Sân",
                    item.CustomerType,
                    item.DayType,
                    item.StartTime.ToString("HH:mm"),
                    item.EndTime.ToString("HH:mm"),
                    item.HourlyRate,
                    item.EffectiveFrom.ToString("yyyy-MM-dd"),
                    item.CreatedBy,
                    item.CreatedAtUtc,
                    item.IsActive)).ToArray())));
    }

    private static async Task<IResult> UpdateCourtPriceRuleAsync(
        Guid id,
        CreateCourtPriceRuleRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!TryValidateCourtPriceRule(request, out var startTime, out var endTime, out var effectiveFrom, out var holidayDates))
            return Results.BadRequest(ApiEnvelope<object>.Fail("Quy tắc giá sân không hợp lệ."));
        if (!await dbContext.Courts.AnyAsync(item => item.Id == request.CourtId && item.IsActive, cancellationToken))
            return Results.NotFound();
        var rule = await dbContext.CourtPriceRules.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (rule is null) return Results.NotFound();
        var overlap = await EnsureCourtPriceRuleDoesNotOverlapAsync(
            dbContext,
            request.CourtId,
            request.PriceType,
            startTime,
            endTime,
            holidayDates,
            id,
            cancellationToken);
        if (overlap is not null)
        {
            return overlap;
        }

        rule.Update(request.CourtId, request.CustomerType, request.DayType,
            request.PriceType, startTime, endTime, request.HourlyRate, effectiveFrom, JoinHolidayDates(holidayDates));
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { rule.Id }, "Đã cập nhật mức giá."));
    }

    private static async Task<IResult> SetCourtPriceRuleStatusAsync(
        Guid id,
        SetActiveRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var rule = await dbContext.CourtPriceRules.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (rule is null) return Results.NotFound();
        rule.SetActive(request.IsActive);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { rule.Id, rule.IsActive }));
    }

    private static async Task<IResult> DeleteCourtPriceRuleAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var rule = await dbContext.CourtPriceRules.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (rule is null) return Results.NotFound();
        dbContext.CourtPriceRules.Remove(rule);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.NoContent();
    }

    private static bool TryValidateCourtPriceRule(
        CreateCourtPriceRuleRequest request,
        out TimeOnly startTime,
        out TimeOnly endTime,
        out DateOnly effectiveFrom,
        out DateOnly[] holidayDates)
    {
        startTime = default;
        endTime = default;
        effectiveFrom = default;
        holidayDates = [];
        if (request.CustomerType is not ("all" or "guest" or "member" or "coach") ||
            request.DayType is not ("all" or "weekday" or "weekend") ||
            request.PriceType is not ("regular" or "peak" or "holiday") ||
            !TimeOnly.TryParseExact(request.StartTime, "HH:mm", out startTime) ||
            !TimeOnly.TryParseExact(request.EndTime, "HH:mm", out endTime) ||
            !DateOnly.TryParseExact(request.EffectiveFrom, "yyyy-MM-dd", out effectiveFrom))
        {
            return false;
        }

        if (request.PriceType == "holiday")
        {
            holidayDates = ParseHolidayDates(request.HolidayDates);
            return holidayDates.Length > 0 && request.HourlyRate > 0;
        }

        return endTime > startTime && request.HourlyRate > 0;
    }

    private static async Task<IResult> CreateCourtPriceRuleAsync(
        CreateCourtPriceRuleRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!TryValidateCourtPriceRule(
                request,
                out var startTime,
                out var endTime,
                out var effectiveFrom,
                out var holidayDates))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Quy tắc giá sân không hợp lệ.",
                new ApiError("INVALID_COURT_PRICE", null, "Kiểm tra đối tượng, loại ngày, khung giờ, đơn giá và ngày áp dụng.")));
        }

        if (!await dbContext.Courts.AnyAsync(
            item => item.Id == request.CourtId && item.IsActive,
            cancellationToken))
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy sân.",
                new ApiError("COURT_NOT_FOUND", "courtId", "Sân không tồn tại hoặc đã ngưng hoạt động.")));
        }

        var overlap = await EnsureCourtPriceRuleDoesNotOverlapAsync(
            dbContext,
            request.CourtId,
            request.PriceType,
            startTime,
            endTime,
            holidayDates,
            null,
            cancellationToken);
        if (overlap is not null)
        {
            return overlap;
        }

        var rule = new CourtPriceRule(
            request.CourtId,
            request.CustomerType,
            request.DayType,
            request.PriceType,
            startTime,
            endTime,
            request.HourlyRate,
            effectiveFrom,
            JoinHolidayDates(holidayDates),
            principal.Identity?.Name ?? "Admin");
        await dbContext.CourtPriceRules.AddAsync(rule, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created(
            $"{ApiRoutes.Root}/admin/court-pricing/{rule.Id}",
            ApiEnvelope<object>.Ok(new { rule.Id }, "Đã lưu mức giá mới. Booking cũ giữ nguyên đơn giá đã xác nhận."));
    }

    private static AdminCourtPriceRuleResponse ToCourtPriceRuleResponse(
        CourtPriceRule rule,
        string courtName) =>
        new(
            rule.Id,
            rule.CourtId,
            courtName,
            rule.CustomerType,
            rule.DayType,
            rule.StartTime.ToString("HH:mm"),
            rule.EndTime.ToString("HH:mm"),
            rule.HourlyRate,
            rule.EffectiveFrom.ToString("yyyy-MM-dd"),
            rule.CreatedBy,
            rule.CreatedAtUtc,
            rule.IsActive,
            rule.PriceType,
            SplitHolidayDates(rule.HolidayDates).Select(date => date.ToString("yyyy-MM-dd")).ToArray());

    private static DateOnly[] ParseHolidayDates(IReadOnlyCollection<string>? values) =>
        (values ?? [])
            .Select(value => DateOnly.TryParseExact(value, "yyyy-MM-dd", out var date)
                ? date
                : (DateOnly?)null)
            .Where(value => value.HasValue)
            .Select(value => value!.Value)
            .Distinct()
            .Order()
            .ToArray();

    private static DateOnly[] SplitHolidayDates(string value) =>
        string.IsNullOrWhiteSpace(value)
            ? []
            : value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(item => DateOnly.TryParseExact(item, "yyyy-MM-dd", out var date)
                    ? date
                    : (DateOnly?)null)
                .Where(item => item.HasValue)
                .Select(item => item!.Value)
                .Distinct()
                .Order()
                .ToArray();

    private static string JoinHolidayDates(IEnumerable<DateOnly> values) =>
        string.Join(',', values.Distinct().Order().Select(date => date.ToString("yyyy-MM-dd")));

    private static async Task<IResult?> EnsureCourtPriceRuleDoesNotOverlapAsync(
        PickleTrackDbContext dbContext,
        Guid courtId,
        string priceType,
        TimeOnly startTime,
        TimeOnly endTime,
        DateOnly[] holidayDates,
        Guid? excludedRuleId,
        CancellationToken cancellationToken)
    {
        var existingRules = await dbContext.CourtPriceRules.AsNoTracking()
            .Where(item =>
                item.CourtId == courtId &&
                item.IsActive &&
                (!excludedRuleId.HasValue || item.Id != excludedRuleId.Value))
            .ToListAsync(cancellationToken);

        if (priceType == "holiday")
        {
            var duplicateDate = existingRules
                .Where(item => item.PriceType == "holiday")
                .SelectMany(item => SplitHolidayDates(item.HolidayDates))
                .Intersect(holidayDates)
                .Any();

            return duplicateDate
                ? Results.Conflict(ApiEnvelope<object>.Fail(
                    "Ngay le da co cau hinh gia tren san nay.",
                    new ApiError("COURT_PRICE_DATE_OVERLAP", "holidayDates", "Hay bo ngay trung hoac sua cau hinh gia hien co.")))
                : null;
        }

        if (priceType is not ("regular" or "peak"))
        {
            return null;
        }

        var hasTimeOverlap = existingRules.Any(item =>
            item.PriceType is "regular" or "peak" &&
            startTime < item.EndTime &&
            endTime > item.StartTime);

        return hasTimeOverlap
            ? Results.Conflict(ApiEnvelope<object>.Fail(
                "Khung gio gia bi trung tren cung san.",
                new ApiError("COURT_PRICE_TIME_OVERLAP", "startTime", "Hay chon khung gio khac de tranh mau thuan gia.")))
            : null;
    }

    private static async Task<IResult> GetBookingConflictsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var bookings = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => item.Status != "cancelled" && item.EndsAtUtc >= DateTimeOffset.UtcNow.AddDays(-7))
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var courts = await dbContext.Courts.AsNoTracking().ToDictionaryAsync(item => item.Id, cancellationToken);
        var classes = await dbContext.Classes.AsNoTracking().ToListAsync(cancellationToken);
        var sessions = await dbContext.Sessions.AsNoTracking()
            .Where(item => !item.IsCancelled && item.EndsAtUtc >= DateTimeOffset.UtcNow.AddDays(-7))
            .ToListAsync(cancellationToken);
        var coachNames = await dbContext.Coaches.AsNoTracking().ToDictionaryAsync(item => item.Id, item => item.FullName, cancellationToken);
        var courtIds = courts.Values.ToDictionary(item => item.Name, item => item.Id, StringComparer.OrdinalIgnoreCase);
        var rows = new List<AdminBookingConflictResponse>();

        foreach (var group in bookings.GroupBy(item => item.CourtId))
        {
            var ordered = group.OrderBy(item => item.StartsAtUtc).ToArray();
            for (var leftIndex = 0; leftIndex < ordered.Length; leftIndex++)
            {
                for (var rightIndex = leftIndex + 1; rightIndex < ordered.Length; rightIndex++)
                {
                    var left = ordered[leftIndex];
                    var right = ordered[rightIndex];
                    if (right.StartsAtUtc >= left.EndsAtUtc) break;
                    rows.Add(CreateConflict(
                        $"booking:{left.Id}:{right.Id}",
                        left.Id,
                        courts.GetValueOrDefault(left.CourtId)?.Name ?? "Sân",
                        "Booking trùng booking",
                        left.CustomerName,
                        right.CustomerName,
                        left.StartsAtUtc,
                        left.EndsAtUtc,
                        right.StartsAtUtc,
                        right.EndsAtUtc,
                        timeZone));
                }
            }
        }

        foreach (var session in sessions)
        {
            var trainingClass = classes.FirstOrDefault(item => item.Id == session.ClassId);
            if (trainingClass is null)
            {
                continue;
            }
            var courtId = trainingClass.CourtId;
            if (courtId is null)
            {
                if (trainingClass.CourtName is null ||
                    !courtIds.TryGetValue(trainingClass.CourtName, out var mappedCourtId))
                {
                    continue;
                }
                courtId = mappedCourtId;
            }
            foreach (var booking in bookings.Where(item =>
                         item.CourtId == courtId.Value &&
                         item.StartsAtUtc < session.EndsAtUtc &&
                         item.EndsAtUtc > session.StartsAtUtc))
            {
                rows.Add(CreateConflict(
                    $"class:{session.Id}:{booking.Id}",
                    booking.Id,
                    courts.GetValueOrDefault(courtId.Value)?.Name ??
                        trainingClass.CourtName ??
                        "Sân",
                    "Lớp HLV trùng booking",
                    trainingClass.Name,
                    booking.CustomerName,
                    session.StartsAtUtc,
                    session.EndsAtUtc,
                    booking.StartsAtUtc,
                    booking.EndsAtUtc,
                    timeZone,
                    coachNames.GetValueOrDefault(trainingClass.CoachId)));
            }
        }

        return Results.Ok(ApiEnvelope<IReadOnlyCollection<AdminBookingConflictResponse>>.Ok(rows));
    }

    private static AdminBookingConflictResponse CreateConflict(
        string id,
        Guid bookingId,
        string courtName,
        string type,
        string firstTitle,
        string secondTitle,
        DateTimeOffset firstStart,
        DateTimeOffset firstEnd,
        DateTimeOffset secondStart,
        DateTimeOffset secondEnd,
        TimeZoneInfo timeZone,
        string? coachName = null)
    {
        var localFirstStart = TimeZoneInfo.ConvertTime(firstStart, timeZone);
        var localFirstEnd = TimeZoneInfo.ConvertTime(firstEnd, timeZone);
        var localSecondStart = TimeZoneInfo.ConvertTime(secondStart, timeZone);
        var localSecondEnd = TimeZoneInfo.ConvertTime(secondEnd, timeZone);
        return new AdminBookingConflictResponse(
            id,
            bookingId,
            courtName,
            type,
            coachName,
            localFirstStart.ToString("yyyy-MM-dd"),
            new[]
            {
                new AdminConflictScheduleResponse(firstTitle, $"{localFirstStart:HH:mm} - {localFirstEnd:HH:mm}"),
                new AdminConflictScheduleResponse(secondTitle, $"{localSecondStart:HH:mm} - {localSecondEnd:HH:mm}")
            });
    }

    private static async Task<IResult> ResolveBookingConflictAsync(
        Guid bookingId,
        ResolveBookingConflictRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Action is not ("moveCourt" or "changeTime" or "cancel" or "contactNote") ||
            string.IsNullOrWhiteSpace(request.Note))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Phương án xử lý chưa hợp lệ.",
                new ApiError("INVALID_CONFLICT_ACTION", "action", "Chọn phương án và nhập ghi chú xử lý.")));
        }

        var booking = await dbContext.CourtBookings.SingleOrDefaultAsync(item => item.Id == bookingId, cancellationToken);
        if (booking is null) return Results.NotFound();

        var resolved = false;
        if (request.Action == "cancel")
        {
            booking.Cancel();
            var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(
                item => item.SourceType == "courtBooking" && item.SourceId == booking.Id,
                cancellationToken);
            debt?.CloseCancelledSource();
            if (booking.PaidAmount > 0)
            {
                await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
                    $"HT-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}",
                    "refund",
                    "refund",
                    booking.CustomerName,
                    booking.PaidAmount,
                    booking.PaymentMethod ?? "other",
                    DateTimeOffset.UtcNow,
                    $"BOOKING:{booking.Id:N}",
                    $"Hoàn tiền booking bị hủy: {request.Note.Trim()}",
                    "reconciled",
                    booking.PaidAmount,
                    createdBy: principal.Identity?.Name ?? "Admin"), cancellationToken);
            }
            resolved = true;
        }
        else if (request.Action is "moveCourt" or "changeTime")
        {
            var targetCourtId = request.CourtId ?? booking.CourtId;
            var targetCourt = await dbContext.Courts.SingleOrDefaultAsync(
                item => item.Id == targetCourtId && item.IsActive,
                cancellationToken);
            if (targetCourt is null) return Results.NotFound();

            var startsAtUtc = booking.StartsAtUtc;
            var endsAtUtc = booking.EndsAtUtc;
            if (request.Action == "changeTime")
            {
                if (!DateOnly.TryParseExact(request.Date, "yyyy-MM-dd", out var date) ||
                    !TimeOnly.TryParseExact(request.StartTime, "HH:mm", out var start) ||
                    !TimeOnly.TryParseExact(request.EndTime, "HH:mm", out var end) ||
                    end <= start)
                {
                    return Results.BadRequest(ApiEnvelope<object>.Fail(
                        "Khung giờ mới không hợp lệ.",
                        new ApiError("INVALID_RESCHEDULE_TIME", "startTime", "Ngày và giờ mới là bắt buộc.")));
                }
                var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
                startsAtUtc = ToUtc(date, start, timeZone);
                endsAtUtc = ToUtc(date, end, timeZone);
            }

            if (await HasCourtScheduleOverlapAsync(
                    dbContext,
                    targetCourt,
                    startsAtUtc,
                    endsAtUtc,
                    booking.Id,
                    cancellationToken))
            {
                return Results.Conflict(ApiEnvelope<object>.Fail(
                    "Phương án mới vẫn xung đột lịch.",
                    new ApiError("BOOKING_OVERLAP", null, "Chọn sân hoặc khung giờ khác trước khi xác nhận.")));
            }

            var durationHours = (decimal)(endsAtUtc - startsAtUtc).TotalHours;
            booking.Reschedule(targetCourtId, startsAtUtc, endsAtUtc, targetCourt.HourlyRate * durationHours);
            await SyncBookingDebtAsync(booking.Id, dbContext, cancellationToken);
            resolved = true;
        }

        var audit = new BookingConflictResolution(
            booking.Id,
            request.Action,
            request.Note.Trim(),
            principal.Identity?.Name ?? "Admin");
        await dbContext.BookingConflictResolutions.AddAsync(audit, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new
        {
            booking.Id,
            Resolved = resolved,
            audit.Action,
            audit.ResolvedBy,
            audit.ResolvedAtUtc
        }, resolved ? "Đã giải quyết xung đột." : "Đã lưu ghi chú liên hệ; xung đột vẫn cần xử lý."));
    }

    private static async Task<IResult> GetRenewalOptionsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var members = await BuildMemberRowsAsync(dbContext, cancellationToken);
        var packages = await dbContext.Packages.AsNoTracking()
            .Where(item => item.IsActive)
            .OrderBy(item => item.Price)
            .Select(item => new AdminRenewalPackageResponse(item.Id, item.Name, item.SessionCount, item.Price))
            .ToListAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<AdminRenewalOptionsResponse>.Ok(
            new AdminRenewalOptionsResponse(
                members.Select(item => new AdminRenewalMemberResponse(
                    item.Id,
                    item.Name,
                    item.Phone,
                    item.ClassName,
                    item.RemainingSessions,
                    item.Status)).ToArray(),
                packages)));
    }

    private static async Task<IResult> CreateMemberRenewalAsync(
        CreateMemberRenewalRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.PaymentMethod is not ("cash" or "transfer" or "card" or "debt"))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Phương thức thanh toán không hợp lệ.",
                new ApiError("INVALID_PAYMENT_METHOD", "paymentMethod", "Chọn tiền mặt, chuyển khoản, thẻ hoặc công nợ.")));
        }
        var member = await dbContext.Members.SingleOrDefaultAsync(item => item.Id == request.MemberId, cancellationToken);
        var package = await dbContext.Packages.SingleOrDefaultAsync(
            item => item.Id == request.PackageId && item.IsActive,
            cancellationToken);
        if (member is null || package is null) return Results.NotFound();

        var sessions = request.Sessions > 0 ? request.Sessions : package.SessionCount;
        var amount = request.Amount > 0 ? request.Amount : package.Price;
        var isDebt = request.PaymentMethod == "debt";
        var renewal = new PaymentRenewal(
            member.Id,
            package.Id,
            sessions,
            amount,
            request.PaymentMethod,
            isDebt ? "debt" : "paid",
            request.Note,
            DateTimeOffset.UtcNow,
            DateTimeOffset.UtcNow.AddDays(package.ValidityDays),
            package.FreeCourtUses);
        await dbContext.PaymentRenewals.AddAsync(renewal, cancellationToken);

        if (isDebt)
        {
            await dbContext.FinanceDebts.AddAsync(new FinanceDebt(
                "receivable",
                member.FullName,
                $"Gia hạn {package.Name}",
                amount,
                0,
                DateTimeOffset.UtcNow.AddDays(7),
                "memberRenewal",
                renewal.Id,
                "member"), cancellationToken);
        }
        else
        {
            var code = $"PT-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";
            await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
                code,
                "income",
                "membership",
                member.FullName,
                amount,
                request.PaymentMethod,
                DateTimeOffset.UtcNow,
                $"RENEWAL:{renewal.Id:N}",
                request.Note,
                "reconciled",
                amount), cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created(
            $"{ApiRoutes.Root}/admin/member-renewals/{renewal.Id}",
            ApiEnvelope<object>.Ok(new
            {
                renewal.Id,
                renewal.SessionsAdded,
                renewal.Amount,
                renewal.PaymentMethod,
                renewal.PaymentStatus
            }, isDebt ? "Đã gia hạn và tạo công nợ." : "Đã gia hạn và ghi nhận phiếu thu."));
    }

    private static async Task<IResult> UpdateCoachProfileAsync(
        Guid id,
        UpdateCoachProfileRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var coach = await dbContext.Coaches.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (coach is null) return Results.NotFound();
        try
        {
            coach.UpdateProfile(
                request.AvatarUrl,
                request.PhoneNumber,
                request.Email,
                request.ProfessionalLevel,
                request.Certificates,
                request.ExperienceYears,
                request.TeachingSkills,
                request.Biography,
                request.WorkingSchedule);
        }
        catch (ArgumentOutOfRangeException)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số năm kinh nghiệm không hợp lệ.",
                new ApiError("INVALID_EXPERIENCE", "experienceYears", "Kinh nghiệm phải từ 0 đến 80 năm.")));
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { coach.Id }, "Đã cập nhật hồ sơ HLV."));
    }

    private static async Task<IResult> GetOwnerReportsAsync(
        string? period,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var days = period == "day" ? 1 : period == "week" ? 7 : 30;
        var startDate = DateOnly.FromDateTime(localNow.Date).AddDays(-(days - 1));
        var startUtc = ToUtc(startDate, TimeOnly.MinValue, timeZone);
        var endUtc = ToUtc(DateOnly.FromDateTime(localNow.Date).AddDays(1), TimeOnly.MinValue, timeZone);
        var bookings = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => item.StartsAtUtc >= startUtc && item.StartsAtUtc < endUtc && item.Status != "cancelled")
            .ToListAsync(cancellationToken);
        var courts = await dbContext.Courts.AsNoTracking().ToListAsync(cancellationToken);
        var classes = await dbContext.Classes.AsNoTracking()
            .Where(item => item.IsActive && item.CourtId != null)
            .ToListAsync(cancellationToken);
        var classIds = classes.Select(item => item.Id).ToArray();
        var sessions = await dbContext.Sessions.AsNoTracking()
            .Where(item =>
                classIds.Contains(item.ClassId) &&
                !item.IsCancelled &&
                item.StartsAtUtc >= startUtc &&
                item.StartsAtUtc < endUtc)
            .ToListAsync(cancellationToken);
        var members = await BuildMemberRowsAsync(dbContext, cancellationToken);
        var newMemberCount = await dbContext.Members.AsNoTracking()
            .CountAsync(item => item.CreatedAtUtc >= startUtc && item.CreatedAtUtc < endUtc, cancellationToken);
        var operatingHours = days * 18m * Math.Max(1, courts.Count);
        var usedHours =
            bookings.Sum(item => (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours) +
            sessions.Sum(item => (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours);
        var courtNames = courts.ToDictionary(item => item.Id, item => item.Name);
        var classCourts = classes.ToDictionary(item => item.Id, item => item.CourtId!.Value);
        var byCourt = courts.Select(court =>
        {
            var courtBookings = bookings.Where(item => item.CourtId == court.Id).ToArray();
            var courtSessions = sessions
                .Where(item => classCourts.GetValueOrDefault(item.ClassId) == court.Id)
                .ToArray();
            return new AdminReportCourtResponse(
                courtNames.GetValueOrDefault(court.Id) ?? "Sân",
                courtBookings.Length,
                courtSessions.Length,
                courtBookings.Sum(item => (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours) +
                courtSessions.Sum(item => (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours));
        })
            .OrderByDescending(item => item.UsedHours)
            .ToArray();
        var peakHour = bookings.Select(item => item.StartsAtUtc)
            .Concat(sessions.Select(item => item.StartsAtUtc))
            .GroupBy(item => TimeZoneInfo.ConvertTime(item, timeZone).Hour)
            .OrderByDescending(group => group.Count())
            .Select(group => $"{group.Key:00}:00 - {group.Key + 1:00}:00")
            .FirstOrDefault() ?? "Chưa có dữ liệu";

        return Results.Ok(ApiEnvelope<AdminOwnerReportResponse>.Ok(new AdminOwnerReportResponse(
            period is "day" or "week" ? period : "month",
            startDate.ToString("dd/MM/yyyy"),
            DateOnly.FromDateTime(localNow.Date).ToString("dd/MM/yyyy"),
            bookings.Count,
            usedHours,
            sessions.Count,
            operatingHours == 0 ? 0 : Math.Round(usedHours / operatingHours * 100m, 1),
            peakHour,
            newMemberCount,
            members.Count(item => item.Status == "expiring"),
            byCourt)));
    }
}

public sealed record AdminCourtPricingResponse(
    IReadOnlyCollection<AdminCourtPriceCourtResponse> Courts,
    IReadOnlyCollection<AdminCourtPriceRuleResponse> Rules);
public sealed record AdminCourtPriceCourtResponse(Guid Id, string Name, decimal BaseHourlyRate);
public sealed record AdminCourtPriceRuleResponse(
    Guid Id, Guid CourtId, string CourtName, string CustomerType, string DayType,
    string StartTime, string EndTime, decimal HourlyRate, string EffectiveFrom,
    string CreatedBy, DateTimeOffset CreatedAtUtc, bool IsActive,
    string PriceType = "regular",
    IReadOnlyCollection<string>? HolidayDates = null);
public sealed record CreateCourtPriceRuleRequest(
    Guid CourtId, string CustomerType, string DayType, string StartTime,
    string EndTime, decimal HourlyRate, string EffectiveFrom,
    string PriceType = "regular",
    IReadOnlyCollection<string>? HolidayDates = null);
public sealed record AdminBookingConflictResponse(
    string Id, Guid BookingId, string CourtName, string Type, string? CoachName,
    string Date, IReadOnlyCollection<AdminConflictScheduleResponse> Schedules);
public sealed record AdminConflictScheduleResponse(string Title, string TimeRange);
public sealed record ResolveBookingConflictRequest(
    string Action, string Note, Guid? CourtId, string? Date, string? StartTime, string? EndTime);
public sealed record AdminRenewalOptionsResponse(
    IReadOnlyCollection<AdminRenewalMemberResponse> Members,
    IReadOnlyCollection<AdminRenewalPackageResponse> Packages);
public sealed record AdminRenewalMemberResponse(
    Guid Id, string Name, string Phone, string CurrentPackage, int RemainingSessions, string Status);
public sealed record AdminRenewalPackageResponse(Guid Id, string Name, int SessionCount, decimal Price);
public sealed record CreateMemberRenewalRequest(
    Guid MemberId, Guid PackageId, int Sessions, decimal Amount,
    string PaymentMethod, string? Note);
public sealed record UpdateCoachProfileRequest(
    string? AvatarUrl, string? PhoneNumber, string? Email, string? ProfessionalLevel,
    string? Certificates, int ExperienceYears, string? TeachingSkills,
    string? Biography, string? WorkingSchedule);
public sealed record AdminOwnerReportResponse(
    string Period, string FromDate, string ToDate, int BookingCount,
    decimal TotalUsageHours, int CoachSessionCount, decimal CourtUtilizationRate,
    string PeakHour, int NewMemberCount, int ExpiringMemberCount,
    IReadOnlyCollection<AdminReportCourtResponse> Courts);
public sealed record AdminReportCourtResponse(
    string CourtName, int BookingCount, int CoachSessionCount, decimal UsedHours);
