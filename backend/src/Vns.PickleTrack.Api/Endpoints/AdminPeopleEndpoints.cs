using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Domain.Enums;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static partial class AdminEndpoints
{
    private static async Task<IResult> CreateCoachAsync(
        CreateCoachRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var fullName = request.FullName.Trim();
        var username = request.Username.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(fullName) ||
            string.IsNullOrWhiteSpace(username) ||
            request.Pin.Length is < 6 or > 20 ||
            request.PartnershipStatus is not ("active" or "paused" or "underReview") ||
            request.AgreementType is not ("hourlyRental" or "revenueShare" or "hybrid") ||
            request.HourlyCourtRate < 0 ||
            request.RevenueSharePercent is < 0 or > 100)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Thông tin HLV không hợp lệ.",
                new ApiError("INVALID_COACH", null, "Kiểm tra hồ sơ, tài khoản, PIN và hình thức hợp tác.")));
        }

        if (await dbContext.Users.AnyAsync(
            item => item.Username.ToLower() == username,
            cancellationToken))
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Tài khoản HLV đã tồn tại.",
                new ApiError("COACH_USERNAME_EXISTS", "username", "Vui lòng sử dụng tài khoản khác.")));
        }

        var user = new User(username, fullName, HashCoachPin(request.Pin), UserRole.Coach);
        var coach = new Coach(
            user.Id,
            fullName,
            request.PartnershipStatus,
            request.AgreementType,
            request.HourlyCourtRate,
            request.RevenueSharePercent);
        await dbContext.Users.AddAsync(user, cancellationToken);
        await dbContext.Coaches.AddAsync(coach, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Created(
            $"/api/v1/admin/coaches/{coach.Id}",
            ApiEnvelope<object>.Ok(new
            {
                coach.Id,
                coach.FullName,
                coach.PartnershipStatus,
                coach.AgreementType,
                coach.HourlyCourtRate,
                coach.RevenueSharePercent,
                coach.PartnershipStartedAtUtc
            }, "Đã tạo hồ sơ hợp tác HLV."));
    }

    private static async Task<IResult> GetPeopleOperationsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var today = DateOnly.FromDateTime(localNow.Date);
        var dayStartUtc = ToUtc(today, TimeOnly.MinValue, timeZone);
        var dayEndUtc = ToUtc(today.AddDays(1), TimeOnly.MinValue, timeZone);
        var monthStartUtc = ToUtc(new DateOnly(localNow.Year, localNow.Month, 1), TimeOnly.MinValue, timeZone);

        var coaches = await dbContext.Coaches.AsNoTracking().OrderBy(item => item.FullName).ToListAsync(cancellationToken);
        var classes = await dbContext.Classes.AsNoTracking().ToListAsync(cancellationToken);
        var sessions = await dbContext.Sessions.AsNoTracking().ToListAsync(cancellationToken);
        var settlements = await dbContext.CoachSettlements.AsNoTracking().ToListAsync(cancellationToken);
        var members = await dbContext.Members.AsNoTracking().OrderBy(item => item.FullName).ToListAsync(cancellationToken);
        var packages = await dbContext.Packages.AsNoTracking().ToDictionaryAsync(item => item.Id, cancellationToken);
        var payments = await dbContext.PaymentRenewals.AsNoTracking().ToListAsync(cancellationToken);
        var bookings = await dbContext.CourtBookings.AsNoTracking().OrderByDescending(item => item.StartsAtUtc).ToListAsync(cancellationToken);
        var courts = await dbContext.Courts.AsNoTracking().ToDictionaryAsync(item => item.Id, cancellationToken);
        var debts = await dbContext.FinanceDebts.AsNoTracking().ToListAsync(cancellationToken);
        var attendance = await dbContext.AttendanceRecords.AsNoTracking().ToListAsync(cancellationToken);
        var courtIdsByName = courts.Values.ToDictionary(item => item.Name, item => item.Id, StringComparer.OrdinalIgnoreCase);
        var period = $"{localNow:yyyy-MM}";

        var coachRows = coaches.Select(coach =>
        {
            var coachClasses = classes.Where(item => item.CoachId == coach.Id).ToArray();
            var classIds = coachClasses.Select(item => item.Id).ToHashSet();
            var coachSessions = sessions.Where(item => classIds.Contains(item.ClassId) && !item.IsCancelled).ToArray();
            var monthSessions = coachSessions.Where(item => item.StartsAtUtc >= monthStartUtc).ToArray();
            var usageHours = monthSessions.Sum(item => (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours);
            var settlement = settlements.FirstOrDefault(item => item.CoachId == coach.Id && item.Period == period);
            var conflictCount = monthSessions.Count(session => HasBookingConflict(
                session,
                coachClasses,
                courtIdsByName,
                bookings));
            return new AdminCoachSummaryResponse(
                coach.Id,
                coach.FullName,
                coach.PartnershipStatus,
                coach.AgreementType,
                coach.HourlyCourtRate,
                coach.RevenueSharePercent,
                coach.PartnershipStartedAtUtc,
                coachSessions.Count(item => item.StartsAtUtc >= dayStartUtc && item.StartsAtUtc < dayEndUtc),
                coachSessions.Count(item => item.StartsAtUtc >= DateTimeOffset.UtcNow),
                usageHours,
                settlement?.OutstandingAmount ?? 0m,
                conflictCount,
                coach.AvatarUrl,
                coach.PhoneNumber,
                coach.Email,
                coach.ProfessionalLevel,
                coach.Certificates,
                coach.ExperienceYears,
                coach.TeachingSkills,
                coach.Biography,
                coach.WorkingSchedule);
        }).ToArray();

        var coachOperations = coaches.Select(coach =>
        {
            var coachClasses = classes.Where(item => item.CoachId == coach.Id).ToArray();
            var classIds = coachClasses.Select(item => item.Id).ToHashSet();
            var usageRows = sessions
                .Where(item => classIds.Contains(item.ClassId) && item.StartsAtUtc >= monthStartUtc)
                .OrderByDescending(item => item.StartsAtUtc)
                .Select(session =>
                {
                    var trainingClass = coachClasses.Single(item => item.Id == session.ClassId);
                    var start = TimeZoneInfo.ConvertTime(session.StartsAtUtc, timeZone);
                    var end = TimeZoneInfo.ConvertTime(session.EndsAtUtc, timeZone);
                    return new AdminCoachCourtUsageResponse(
                        session.Id,
                        trainingClass.CourtName ?? "Chưa xếp sân",
                        trainingClass.Name,
                        start.ToString("dd/MM/yyyy"),
                        $"{start:HH:mm}-{end:HH:mm}",
                        (decimal)(session.EndsAtUtc - session.StartsAtUtc).TotalHours,
                        session.IsCancelled ? "cancelled" :
                            session.IsCompleted ? "completed" :
                            session.EndsAtUtc <= DateTimeOffset.UtcNow ? "completed" :
                            session.StartsAtUtc <= DateTimeOffset.UtcNow ? "inProgress" : "scheduled",
                        HasBookingConflict(session, coachClasses, courtIdsByName, bookings));
                })
                .ToArray();
            var settlement = settlements.FirstOrDefault(item => item.CoachId == coach.Id && item.Period == period);
            var paymentRows = settlement is not null && settlement.PaidAmount > 0
                ? new[]
                {
                    new AdminCoachPaymentResponse(
                        settlement.Id,
                        $"Thanh toán phí sân {settlement.Period}",
                        settlement.PaidAmount,
                        TimeZoneInfo.ConvertTime(settlement.UpdatedAtUtc, timeZone).ToString("dd/MM/yyyy"),
                        settlement.ReconciliationStatus)
                }
                : [];
            return new AdminCoachOperationsResponse(
                coach.Id,
                coach.FullName,
                coach.PartnershipStatus,
                coach.AgreementType,
                coach.HourlyCourtRate,
                coach.RevenueSharePercent,
                settlement?.UsageHours ?? usageRows.Sum(item => item.DurationHours),
                settlement?.GrossRevenue ?? 0m,
                settlement?.CourtFee ?? 0m,
                settlement?.PaidAmount ?? 0m,
                settlement?.OutstandingAmount ?? 0m,
                settlement?.ReconciliationStatus ?? "pending",
                settlement?.Id,
                settlement?.Period ?? period,
                settlement?.IsConfirmed ?? false,
                settlement?.ConfirmedBy,
                settlement?.ConfirmedAtUtc is null
                    ? null
                    : TimeZoneInfo.ConvertTime(settlement.ConfirmedAtUtc.Value, timeZone).ToString("dd/MM/yyyy HH:mm"),
                usageRows.Count(item => item.HasConflict),
                usageRows,
                paymentRows);
        }).ToArray();

        var memberRows = members.Select(member =>
        {
            var memberPayments = payments.Where(item => item.MemberId == member.Id).OrderByDescending(item => item.CreatedAtUtc).ToArray();
            var latestPayment = memberPayments.FirstOrDefault();
            var package = latestPayment is null ? null : packages.GetValueOrDefault(latestPayment.PackageId);
            var usedSessions = attendance.Count(item => item.MemberId == member.Id && item.DeductsSession);
            var totalSessions = memberPayments.Sum(item => item.SessionsAdded);
            var remainingSessions = Math.Max(0, totalSessions - usedSessions);
            var outstanding = debts
                .Where(item => item.Direction == "receivable" &&
                    string.Equals(item.Counterparty, member.FullName, StringComparison.OrdinalIgnoreCase))
                .Sum(item => Math.Max(0, item.Amount - item.PaidAmount));
            var status = !member.IsActive ? "inactive" :
                outstanding > 0 ? "paymentDue" :
                remainingSessions <= 3 ? "expiring" : "active";
            var memberBookings = bookings
                .Where(item => item.CustomerPhone == member.PhoneNumber)
                .Select(item =>
                {
                    var start = TimeZoneInfo.ConvertTime(item.StartsAtUtc, timeZone);
                    var end = TimeZoneInfo.ConvertTime(item.EndsAtUtc, timeZone);
                    return new AdminMemberBookingResponse(
                        item.Id,
                        courts.GetValueOrDefault(item.CourtId)?.Name ?? "Sân",
                        start.ToString("dd/MM/yyyy"),
                        $"{start:HH:mm}-{end:HH:mm}",
                        item.Amount,
                        item.Status);
                }).ToArray();
            var paymentRows = memberPayments.Select(item => new AdminMemberPaymentResponse(
                item.Id,
                packages.GetValueOrDefault(item.PackageId)?.Name ?? "Gói hội viên",
                item.Amount,
                TimeZoneInfo.ConvertTime(item.CreatedAtUtc, timeZone).ToString("dd/MM/yyyy"),
                "paid")).ToArray();

            return new AdminMembershipResponse(
                member.Id,
                member.FullName,
                member.PhoneNumber,
                package?.Name ?? "Chưa có gói",
                package?.Price ?? 0,
                totalSessions,
                remainingSessions,
                outstanding,
                status,
                latestPayment is null
                    ? null
                    : TimeZoneInfo.ConvertTime(latestPayment.CreatedAtUtc.AddMonths(1), timeZone).ToString("dd/MM/yyyy"),
                new[]
                {
                    new AdminMemberBenefitResponse(
                        "Số buổi còn lại",
                        $"{remainingSessions}/{totalSessions} buổi",
                        remainingSessions > 0 ? "active" : "used"),
                    new AdminMemberBenefitResponse(
                        "Ưu tiên gia hạn",
                        package is null ? "Chưa kích hoạt" : $"Áp dụng cho {package.Name}",
                        package is null ? "inactive" : "active")
                },
                memberBookings,
                paymentRows);
        }).ToArray();

        var popularPackage = payments
            .GroupBy(item => item.PackageId)
            .OrderByDescending(group => group.Count())
            .Select(group => packages.GetValueOrDefault(group.Key))
            .FirstOrDefault();

        var response = new AdminPeopleOperationsResponse(
            today.ToString("dd/MM/yyyy"),
            coachRows,
            coachOperations,
            memberRows,
            popularPackage is null
                ? null
                : new AdminPopularPackageResponse(
                    popularPackage.Id,
                    popularPackage.Name,
                    popularPackage.Price,
                    popularPackage.SessionCount));
        return Results.Ok(ApiEnvelope<AdminPeopleOperationsResponse>.Ok(response));
    }

    private static async Task<IResult> UpdateCoachAgreementAsync(
        Guid id,
        UpdateCoachAgreementRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.PartnershipStatus is not ("active" or "paused" or "underReview") ||
            request.AgreementType is not ("hourlyRental" or "revenueShare" or "hybrid") ||
            request.HourlyCourtRate < 0 ||
            request.RevenueSharePercent is < 0 or > 100)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Thông tin hợp tác HLV không hợp lệ.",
                new ApiError("INVALID_COACH_AGREEMENT", "agreementType", "Kiểm tra trạng thái, hình thức và tỷ lệ đối soát.")));
        }

        var coach = await dbContext.Coaches.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (coach is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy HLV.",
                new ApiError("COACH_NOT_FOUND", "id", "HLV không tồn tại.")));
        }

        coach.UpdateAgreement(
            request.PartnershipStatus,
            request.AgreementType,
            request.HourlyCourtRate,
            request.RevenueSharePercent);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new
        {
            coach.Id,
            coach.PartnershipStatus,
            coach.AgreementType,
            coach.HourlyCourtRate,
            coach.RevenueSharePercent
        }, "Đã cập nhật hợp tác HLV."));
    }

    private static async Task<IResult> GetCoachReconciliationsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var period = $"{localNow:yyyy-MM}";
        var coaches = await dbContext.Coaches
            .AsNoTracking()
            .OrderBy(item => item.FullName)
            .ToListAsync(cancellationToken);
        var settlements = await dbContext.CoachSettlements
            .AsNoTracking()
            .Where(item => item.Period == period)
            .ToListAsync(cancellationToken);

        var rows = coaches.Select(coach =>
        {
            var settlement = settlements.FirstOrDefault(item => item.CoachId == coach.Id);
            return new AdminCoachReconciliationResponse(
                coach.Id,
                coach.FullName,
                coach.AgreementType,
                coach.HourlyCourtRate,
                coach.RevenueSharePercent,
                settlement?.UsageHours ?? 0m,
                settlement?.GrossRevenue ?? 0m,
                (settlement?.GrossRevenue ?? 0m) * coach.RevenueSharePercent / 100m,
                settlement?.CourtFee ?? 0m,
                settlement?.PaidAmount ?? 0m,
                settlement?.OutstandingAmount ?? 0m,
                settlement?.ReconciliationStatus ?? "pending",
                settlement?.Id,
                settlement?.Period ?? period,
                settlement?.IsConfirmed ?? false,
                settlement?.ConfirmedBy,
                settlement?.ConfirmedAtUtc is null
                    ? null
                    : TimeZoneInfo.ConvertTime(settlement.ConfirmedAtUtc.Value, timeZone)
                        .ToString("dd/MM/yyyy HH:mm"));
        }).ToArray();

        return Results.Ok(ApiEnvelope<AdminCoachReconciliationsResponse>.Ok(
            new AdminCoachReconciliationsResponse(period, rows)));
    }

    private static async Task<IResult> ReconcileCoachSettlementAsync(
        Guid id,
        ReconcileCoachSettlementRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var settlement = await dbContext.CoachSettlements.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (settlement is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy kỳ đối soát.",
                new ApiError("COACH_SETTLEMENT_NOT_FOUND", "id", "Kỳ đối soát không tồn tại.")));
        }
        if (request.PaidAmount < 0 || request.PaidAmount > settlement.CourtFee)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số tiền thanh toán không hợp lệ.",
                new ApiError("INVALID_PAID_AMOUNT", "paidAmount", "Số tiền không được vượt quá phí sân.")));
        }

        settlement.Reconcile(request.PaidAmount);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new
        {
            settlement.Id,
            settlement.PaidAmount,
            settlement.OutstandingAmount,
            settlement.ReconciliationStatus,
            settlement.ReconciledAtUtc
        }, "Đã cập nhật đối soát HLV."));
    }

    private static async Task<IResult> ConfirmCoachSettlementAsync(
        Guid id,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var settlement = await dbContext.CoachSettlements
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (settlement is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy kỳ đối soát.",
                new ApiError("COACH_SETTLEMENT_NOT_FOUND", "id", "Kỳ đối soát không tồn tại.")));
        }
        if (settlement.IsConfirmed)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Kỳ đối soát đã được xác nhận.",
                new ApiError("COACH_SETTLEMENT_ALREADY_CONFIRMED", "id", "Không thể chốt lại kỳ đối soát đã xác nhận.")));
        }

        var coach = await dbContext.Coaches
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == settlement.CoachId, cancellationToken);
        if (coach is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy HLV của kỳ đối soát.",
                new ApiError("COACH_NOT_FOUND", "coachId", "HLV không tồn tại.")));
        }

        var confirmedBy = principal.Identity?.Name ?? "Admin";
        settlement.Confirm(confirmedBy);

        var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(
            item => item.SourceType == "coachSettlement" && item.SourceId == settlement.Id,
            cancellationToken);
        if (debt is null && settlement.OutstandingAmount > 0)
        {
            debt = new FinanceDebt(
                "receivable",
                coach.FullName,
                $"Phí sân HLV kỳ {settlement.Period}",
                settlement.CourtFee,
                settlement.PaidAmount,
                DateTimeOffset.UtcNow.AddDays(7),
                "coachSettlement",
                settlement.Id,
                "coach");
            await dbContext.FinanceDebts.AddAsync(debt, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new
        {
            settlement.Id,
            settlement.Period,
            settlement.IsConfirmed,
            settlement.ConfirmedBy,
            settlement.ConfirmedAtUtc,
            DebtId = debt?.Id
        }, "Đã chốt kỳ đối soát HLV."));
    }

    private static bool HasBookingConflict(
        ClassSession session,
        IReadOnlyCollection<TrainingClass> coachClasses,
        IReadOnlyDictionary<string, Guid> courtIdsByName,
        IReadOnlyCollection<CourtBooking> bookings)
    {
        if (session.IsCancelled)
        {
            return false;
        }

        var trainingClass = coachClasses.FirstOrDefault(item => item.Id == session.ClassId);
        if (trainingClass is null)
        {
            return false;
        }
        var courtId = trainingClass.CourtId;
        if (courtId is null)
        {
            if (trainingClass.CourtName is null ||
                !courtIdsByName.TryGetValue(trainingClass.CourtName, out var mappedCourtId))
            {
                return false;
            }
            courtId = mappedCourtId;
        }

        return bookings.Any(booking =>
            booking.CourtId == courtId.Value &&
            booking.Status != "cancelled" &&
            booking.StartsAtUtc < session.EndsAtUtc &&
            booking.EndsAtUtc > session.StartsAtUtc);
    }

    private static DateTimeOffset ToUtc(DateOnly date, TimeOnly time, TimeZoneInfo timeZone)
    {
        var local = date.ToDateTime(time, DateTimeKind.Unspecified);
        return new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(local, timeZone));
    }

    private static string HashCoachPin(string pin) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(pin)));
}

public sealed record AdminPeopleOperationsResponse(
    string LocalDate,
    IReadOnlyCollection<AdminCoachSummaryResponse> Coaches,
    IReadOnlyCollection<AdminCoachOperationsResponse> CoachOperations,
    IReadOnlyCollection<AdminMembershipResponse> Members,
    AdminPopularPackageResponse? PopularPackage);

public sealed record AdminCoachSummaryResponse(
    Guid Id,
    string Name,
    string Status,
    string AgreementType,
    decimal HourlyCourtRate,
    decimal RevenueSharePercent,
    DateTimeOffset PartnershipStartedAtUtc,
    int TodayUsageCount,
    int UpcomingUsageCount,
    decimal MonthUsageHours,
    decimal OutstandingAmount,
    int ConflictCount,
    string? AvatarUrl,
    string? PhoneNumber,
    string? Email,
    string? ProfessionalLevel,
    string? Certificates,
    int ExperienceYears,
    string? TeachingSkills,
    string? Biography,
    string? WorkingSchedule);

public sealed record AdminCoachOperationsResponse(
    Guid CoachId,
    string CoachName,
    string PartnershipStatus,
    string AgreementType,
    decimal HourlyCourtRate,
    decimal RevenueSharePercent,
    decimal UsageHours,
    decimal GrossRevenue,
    decimal CourtFee,
    decimal PaidAmount,
    decimal OutstandingAmount,
    string ReconciliationStatus,
    Guid? SettlementId,
    string Period,
    bool IsConfirmed,
    string? ConfirmedBy,
    string? ConfirmedAt,
    int ConflictCount,
    IReadOnlyCollection<AdminCoachCourtUsageResponse> UsageHistory,
    IReadOnlyCollection<AdminCoachPaymentResponse> Payments);

public sealed record AdminCoachCourtUsageResponse(
    Guid Id,
    string CourtName,
    string Purpose,
    string Date,
    string TimeRange,
    decimal DurationHours,
    string Status,
    bool HasConflict);

public sealed record AdminCoachPaymentResponse(
    Guid Id,
    string Description,
    decimal Amount,
    string Date,
    string Status);

public sealed record UpdateCoachAgreementRequest(
    string PartnershipStatus,
    string AgreementType,
    decimal HourlyCourtRate,
    decimal RevenueSharePercent);

public sealed record CreateCoachRequest(
    string FullName,
    string Username,
    string Pin,
    string PartnershipStatus,
    string AgreementType,
    decimal HourlyCourtRate,
    decimal RevenueSharePercent);

public sealed record ReconcileCoachSettlementRequest(decimal PaidAmount);

public sealed record AdminCoachReconciliationsResponse(
    string Period,
    IReadOnlyCollection<AdminCoachReconciliationResponse> Reconciliations);

public sealed record AdminCoachReconciliationResponse(
    Guid CoachId,
    string CoachName,
    string AgreementType,
    decimal HourlyCourtRate,
    decimal RevenueSharePercent,
    decimal UsageHours,
    decimal GrossRevenue,
    decimal RevenueShareAmount,
    decimal CourtFee,
    decimal PaidAmount,
    decimal OutstandingAmount,
    string ReconciliationStatus,
    Guid? SettlementId,
    string Period,
    bool IsConfirmed,
    string? ConfirmedBy,
    string? ConfirmedAt);

public sealed record AdminMembershipResponse(
    Guid Id,
    string Name,
    string Phone,
    string PackageName,
    decimal PackagePrice,
    int TotalSessions,
    int RemainingSessions,
    decimal OutstandingAmount,
    string Status,
    string? ExpiresOn,
    IReadOnlyCollection<AdminMemberBenefitResponse> Benefits,
    IReadOnlyCollection<AdminMemberBookingResponse> Bookings,
    IReadOnlyCollection<AdminMemberPaymentResponse> Payments);

public sealed record AdminMemberBenefitResponse(string Name, string Detail, string Status);

public sealed record AdminMemberBookingResponse(
    Guid Id,
    string CourtName,
    string Date,
    string TimeRange,
    decimal Amount,
    string Status);

public sealed record AdminMemberPaymentResponse(
    Guid Id,
    string Description,
    decimal Amount,
    string Date,
    string Status);

public sealed record AdminPopularPackageResponse(
    Guid Id,
    string Name,
    decimal Price,
    int SessionCount);
