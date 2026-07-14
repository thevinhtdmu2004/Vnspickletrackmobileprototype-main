using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Application.Routes;
using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static partial class AdminEndpoints
{
    private static async Task<IResult> GetFinanceOperationsAsync(
        string? period,
        string? dateFrom,
        string? dateTo,
        string? branch,
        string? transactionType,
        string? category,
        string? method,
        string? status,
        string? createdBy,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var normalizedPeriod = period is "today" or "week" or "month" ? period : "month";
        var (rangeStartUtc, rangeEndUtc) = GetFinanceRange(normalizedPeriod, localNow, timeZone);
        if (DateOnly.TryParseExact(dateFrom, "yyyy-MM-dd", out var fromDate))
        {
            rangeStartUtc = ToFinanceUtc(fromDate, TimeOnly.MinValue, timeZone);
        }
        if (DateOnly.TryParseExact(dateTo, "yyyy-MM-dd", out var toDate))
        {
            rangeEndUtc = ToFinanceUtc(toDate.AddDays(1), TimeOnly.MinValue, timeZone);
        }

        var entryQuery = dbContext.FinanceEntries
            .AsNoTracking()
            .Where(item => item.OccurredAtUtc >= rangeStartUtc && item.OccurredAtUtc < rangeEndUtc);
        if (!string.IsNullOrWhiteSpace(branch) && branch != "all")
            entryQuery = entryQuery.Where(item => item.BranchName == branch);
        if (!string.IsNullOrWhiteSpace(transactionType) && transactionType != "all")
            entryQuery = entryQuery.Where(item => item.Type == transactionType);
        if (!string.IsNullOrWhiteSpace(category) && category != "all")
            entryQuery = entryQuery.Where(item => item.Category == category);
        if (!string.IsNullOrWhiteSpace(method) && method != "all")
            entryQuery = entryQuery.Where(item => item.Method == method);
        if (!string.IsNullOrWhiteSpace(status) && status != "all")
            entryQuery = entryQuery.Where(item => item.ReconciliationStatus == status);
        if (!string.IsNullOrWhiteSpace(createdBy) && createdBy != "all")
            entryQuery = entryQuery.Where(item => item.CreatedBy == createdBy || item.ConfirmedBy == createdBy);

        var entries = await entryQuery
            .OrderByDescending(item => item.OccurredAtUtc)
            .ToListAsync(cancellationToken);

        var rows = entries
            .Select(item => new FinanceOperationRow(
                item.Id,
                item.Code,
                item.OccurredAtUtc,
                item.Type,
                item.Category,
                item.Counterparty,
                item.Note ?? FinanceCategoryLabel(item.Category),
                item.Amount,
                item.ActualAmount,
                item.Method,
                item.ReconciliationStatus,
                item.ReferenceCode,
                item.BranchName,
                item.CreatedBy,
                item.ConfirmedBy,
                item.ConfirmedAtUtc))
            .OrderByDescending(item => item.OccurredAtUtc)
            .ToArray();

        var income = rows.Where(item => item.Type == "income").Sum(item => item.Amount);
        var expense = rows.Where(item => item.Type == "expense").Sum(item => item.Amount);
        var refunds = rows.Where(item => item.Type == "refund").Sum(item => item.Amount);
        var collected = rows
            .Where(item => item.Type == "income" && item.ReconciliationStatus == "reconciled")
            .Sum(item => item.ActualAmount ?? item.Amount);
        var actualExpense = rows
            .Where(item => (item.Type is "expense" or "refund") && item.ReconciliationStatus == "reconciled")
            .Sum(item => item.ActualAmount ?? item.Amount);
        var totalDifference = rows.Sum(item => (item.ActualAmount ?? item.Amount) - item.Amount);
        var incomeByCategory = rows
            .Where(item => item.Type == "income")
            .GroupBy(item => item.Category)
            .Select(group => new AdminFinanceSourceResponse(
                group.Key,
                FinanceCategoryLabel(group.Key),
                group.Sum(item => item.Amount),
                income > 0 ? Math.Round(group.Sum(item => item.Amount) / income * 100m, 1) : 0))
            .OrderByDescending(item => item.Amount)
            .ToArray();

        var debts = await dbContext.FinanceDebts
            .AsNoTracking()
            .OrderBy(item => item.DueAtUtc)
            .ToListAsync(cancellationToken);
        var debtRows = debts.Select(item =>
        {
            var outstanding = Math.Max(0, item.Amount - item.PaidAmount);
            var status = item.IsCancelled ? "cancelled" :
                outstanding == 0 ? "paid" :
                item.PaidAmount > 0 ? "partial" :
                item.DueAtUtc < DateTimeOffset.UtcNow ? "overdue" : "open";
            return new AdminFinanceDebtResponse(
                item.Id,
                item.Direction,
                item.CounterpartyType,
                item.Counterparty,
                item.Description,
                item.Amount,
                item.PaidAmount,
                outstanding,
                TimeZoneInfo.ConvertTime(item.DueAtUtc, timeZone).ToString("dd/MM/yyyy"),
                status,
                item.SourceType,
                item.SourceId);
        }).ToArray();
        var transactionRows = rows.Select(item =>
        {
            var actual = item.ActualAmount ?? item.Amount;
            return new AdminFinanceOperationTransactionResponse(
                item.Id,
                item.Code,
                TimeZoneInfo.ConvertTime(item.OccurredAtUtc, timeZone).ToString("dd/MM/yyyy HH:mm"),
                item.Type,
                item.Category,
                FinanceCategoryLabel(item.Category),
                item.Counterparty,
                item.Description,
                item.Amount,
                item.ActualAmount,
                item.ActualAmount.HasValue ? actual - item.Amount : 0,
                item.Method,
                item.ReconciliationStatus,
                item.ReferenceCode,
                item.BranchName,
                item.CreatedBy,
                item.ConfirmedBy,
                item.ConfirmedAtUtc.HasValue
                    ? TimeZoneInfo.ConvertTime(item.ConfirmedAtUtc.Value, timeZone).ToString("dd/MM/yyyy HH:mm")
                    : null);
        }).ToArray();

        var response = new AdminFinanceOperationsResponse(
            normalizedPeriod,
            new AdminFinanceSummaryResponse(
                income,
                expense,
                refunds,
                collected - actualExpense,
                totalDifference,
                transactionRows.Count(item => item.ReconciliationStatus is "pending" or "mismatch")),
            incomeByCategory,
            transactionRows,
            new AdminFinanceDebtSummaryResponse(
                debtRows.Where(item => item.Direction == "receivable").Sum(item => item.OutstandingAmount),
                debtRows.Where(item => item.Direction == "payable").Sum(item => item.OutstandingAmount),
                debtRows.Count(item => item.Status == "overdue")),
            debtRows,
            transactionRows
                .Where(item => item.ReconciliationStatus is "pending" or "mismatch")
                .ToArray());

        return Results.Ok(ApiEnvelope<AdminFinanceOperationsResponse>.Ok(response));
    }

    private static async Task<IResult> CreateFinanceEntryAsync(
        CreateFinanceEntryRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Type is not ("income" or "expense" or "refund") ||
            request.Amount <= 0 ||
            string.IsNullOrWhiteSpace(request.Counterparty) ||
            string.IsNullOrWhiteSpace(request.Category))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Thông tin phiếu thu/chi chưa hợp lệ.",
                new ApiError("INVALID_FINANCE_ENTRY", "amount", "Loại phiếu, đối tác và số tiền là bắt buộc.")));
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var occurredAtUtc = DateTimeOffset.UtcNow;
        if (!string.IsNullOrWhiteSpace(request.Date))
        {
            if (!DateOnly.TryParseExact(request.Date, "yyyy-MM-dd", out var date))
            {
                return Results.BadRequest(ApiEnvelope<object>.Fail(
                    "Ngày giao dịch không hợp lệ.",
                    new ApiError("INVALID_DATE", "date", "Ngày phải theo định dạng yyyy-MM-dd.")));
            }

            var localDateTime = date.ToDateTime(TimeOnly.FromDateTime(localNow.DateTime), DateTimeKind.Unspecified);
            occurredAtUtc = new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(localDateTime, timeZone));
        }

        var prefix = request.Type switch
        {
            "income" => "PT",
            "refund" => "HT",
            _ => "PC"
        };
        var code = $"{prefix}-{localNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";
        var entry = new FinanceEntry(
            code,
            request.Type,
            request.Category.Trim(),
            request.Counterparty.Trim(),
            request.Amount,
            request.Method is "cash" or "transfer" or "card" ? request.Method : "other",
            occurredAtUtc,
            string.IsNullOrWhiteSpace(request.ReferenceCode) ? null : request.ReferenceCode.Trim(),
            string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim(),
            branchName: string.IsNullOrWhiteSpace(request.BranchName) ? "Cơ sở chính" : request.BranchName.Trim(),
            createdBy: principal.Identity?.Name ?? "Admin");
        await dbContext.FinanceEntries.AddAsync(entry, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Created(
            $"{ApiRoutes.Root}/admin/finance-entries/{entry.Id}",
            ApiEnvelope<object>.Ok(new { entry.Id, entry.Code }, "Đã lưu phiếu thu/chi."));
    }

    private static async Task<IResult> CreateFinanceDebtAsync(
        CreateFinanceDebtRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Direction is not ("receivable" or "payable") ||
            request.Amount <= 0 ||
            string.IsNullOrWhiteSpace(request.Counterparty) ||
            string.IsNullOrWhiteSpace(request.Description) ||
            !DateOnly.TryParseExact(request.DueDate, "yyyy-MM-dd", out var dueDate))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Thông tin công nợ chưa hợp lệ.",
                new ApiError("INVALID_DEBT", "amount", "Loại công nợ, đối tác, nội dung, hạn và số tiền là bắt buộc.")));
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var dueLocal = dueDate.ToDateTime(new TimeOnly(23, 59), DateTimeKind.Unspecified);
        var debt = new FinanceDebt(
            request.Direction,
            request.Counterparty.Trim(),
            request.Description.Trim(),
            request.Amount,
            0,
            new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(dueLocal, timeZone)),
            request.SourceType,
            request.SourceId,
            NormalizeCounterpartyType(request.CounterpartyType));
        await dbContext.FinanceDebts.AddAsync(debt, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Created(
            $"{ApiRoutes.Root}/admin/debts/{debt.Id}",
            ApiEnvelope<object>.Ok(new { debt.Id }, "Đã tạo khoản công nợ."));
    }

    private static async Task<IResult> ReconcileFinanceEntryAsync(
        Guid id,
        ReconcileFinanceEntryRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.ActualAmount < 0)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số tiền thực nhận không hợp lệ.",
                new ApiError("INVALID_ACTUAL_AMOUNT", "actualAmount", "Số tiền thực nhận không được âm.")));
        }

        var entry = await dbContext.FinanceEntries
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (entry is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy giao dịch cần đối soát.",
                new ApiError("FINANCE_ENTRY_NOT_FOUND", "id", "Giao dịch không tồn tại.")));
        }

        entry.Reconcile(request.ActualAmount, principal.Identity?.Name ?? "Admin");
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(
            new { entry.Id, entry.ReconciliationStatus, entry.ActualAmount },
            "Đã cập nhật kết quả đối soát."));
    }

    private static async Task<IResult> GetDebtsAsync(
        string? category,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var query = dbContext.FinanceDebts.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(category) && category != "all")
        {
            var normalizedCategory = NormalizeCounterpartyType(category);
            query = query.Where(item => item.CounterpartyType == normalizedCategory);
        }

        var debts = await query.OrderBy(item => item.DueAtUtc).ToListAsync(cancellationToken);
        var references = debts
            .SelectMany(item => new[] { DebtReference(item.Id), CoachDebtReference(item.Id) })
            .ToArray();
        var payments = await dbContext.FinanceEntries
            .AsNoTracking()
            .Where(item => item.ReferenceCode != null && references.Contains(item.ReferenceCode))
            .OrderByDescending(item => item.OccurredAtUtc)
            .ToListAsync(cancellationToken);

        var now = DateTimeOffset.UtcNow;
        var rows = debts.Select(debt =>
        {
            var outstanding = debt.OutstandingAmount;
            var status = debt.IsCancelled ? "cancelled" :
                outstanding == 0 ? "paid" :
                debt.DueAtUtc < now ? "overdue" :
                debt.PaidAmount > 0 ? "partial" : "open";
            var history = payments
                .Where(item => item.ReferenceCode == DebtReference(debt.Id) ||
                    item.ReferenceCode == CoachDebtReference(debt.Id))
                .Select(item => new AdminDebtPaymentResponse(
                    item.Id,
                    item.Code,
                    item.Amount,
                    item.Method,
                    TimeZoneInfo.ConvertTime(item.OccurredAtUtc, timeZone).ToString("dd/MM/yyyy HH:mm")))
                .ToArray();
            return new AdminDebtResponse(
                debt.Id,
                debt.Direction,
                debt.CounterpartyType,
                debt.Counterparty,
                debt.Description,
                TimeZoneInfo.ConvertTime(debt.CreatedAtUtc, timeZone).ToString("dd/MM/yyyy"),
                TimeZoneInfo.ConvertTime(debt.DueAtUtc, timeZone).ToString("dd/MM/yyyy"),
                debt.Amount,
                debt.PaidAmount,
                outstanding,
                status,
                debt.SourceType,
                debt.SourceId,
                history);
        }).ToArray();

        var response = new AdminDebtsResponse(
            rows.Where(item => item.Direction == "receivable").Sum(item => item.OutstandingAmount),
            rows.Where(item => item.Direction == "payable").Sum(item => item.OutstandingAmount),
            rows.Where(item => item.Status is not ("paid" or "overdue") &&
                debts.Single(debt => debt.Id == item.Id).DueAtUtc <= now.AddDays(7))
                .Sum(item => item.OutstandingAmount),
            rows.Where(item => item.Status == "overdue").Sum(item => item.OutstandingAmount),
            rows.Where(item => item.Status == "partial").Sum(item => item.OutstandingAmount),
            rows);
        return Results.Ok(ApiEnvelope<AdminDebtsResponse>.Ok(response));
    }

    private static async Task<IResult> RecordDebtPaymentAsync(
        Guid id,
        RecordDebtPaymentRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (debt is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy khoản công nợ.",
                new ApiError("DEBT_NOT_FOUND", "id", "Khoản công nợ không tồn tại.")));
        }
        if (debt.IsCancelled)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Khoản công nợ đã bị hủy."));
        }
        if (request.Amount <= 0 || request.Amount > debt.OutstandingAmount)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số tiền thanh toán không hợp lệ.",
                new ApiError("INVALID_DEBT_PAYMENT", "amount", "Số tiền phải lớn hơn 0 và không vượt quá dư nợ.")));
        }

        debt.RecordPayment(request.Amount);
        var localNow = TimeZoneInfo.ConvertTime(
            DateTimeOffset.UtcNow,
            TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"));
        var entryCode = $"{(debt.Direction == "receivable" ? "PT" : "PC")}-{localNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";
        CourtBooking? sourceBooking = null;
        if (debt.SourceType == "courtBooking" && debt.SourceId.HasValue)
        {
            sourceBooking = await dbContext.CourtBookings.SingleOrDefaultAsync(
                item => item.Id == debt.SourceId.Value,
                cancellationToken);
            if (sourceBooking is not null)
            {
                var bookingMethod = request.Method is "cash" or "transfer" or "card" ? request.Method : "other";
                sourceBooking.RecordPayment(request.Amount, bookingMethod, entryCode);
                await dbContext.BookingPayments.AddAsync(new BookingPayment(
                    sourceBooking.Id,
                    entryCode,
                    request.Amount,
                    bookingMethod,
                    DateTimeOffset.UtcNow,
                    "Admin",
                    note: request.Note), cancellationToken);
            }
        }
        var entry = new FinanceEntry(
            entryCode,
            debt.Direction == "receivable" ? "income" : "expense",
            "debtPayment",
            debt.Counterparty,
            request.Amount,
            request.Method is "cash" or "transfer" or "card" ? request.Method : "other",
            DateTimeOffset.UtcNow,
            sourceBooking is null ? DebtReference(debt.Id) : $"BOOKING:{sourceBooking.Id:N}",
            string.IsNullOrWhiteSpace(request.Note)
                ? $"Thanh toán công nợ: {debt.Description}"
                : request.Note.Trim(),
            "reconciled",
            request.Amount);
        await dbContext.FinanceEntries.AddAsync(entry, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Ok(ApiEnvelope<object>.Ok(new
        {
            debt.Id,
            debt.PaidAmount,
            debt.OutstandingAmount,
            entry.Code
        }, "Đã ghi nhận thanh toán công nợ."));
    }

    private static (DateTimeOffset StartUtc, DateTimeOffset EndUtc) GetFinanceRange(
        string period,
        DateTimeOffset localNow,
        TimeZoneInfo timeZone)
    {
        var today = DateOnly.FromDateTime(localNow.Date);
        var startDate = period switch
        {
            "today" => today,
            "week" => today.AddDays(-((7 + (int)localNow.DayOfWeek - (int)DayOfWeek.Monday) % 7)),
            _ => new DateOnly(localNow.Year, localNow.Month, 1)
        };
        var endDate = period switch
        {
            "today" => startDate.AddDays(1),
            "week" => startDate.AddDays(7),
            _ => startDate.AddMonths(1)
        };
        var startLocal = startDate.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified);
        var endLocal = endDate.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified);
        return (
            new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(startLocal, timeZone)),
            new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(endLocal, timeZone)));
    }

    private static DateTimeOffset ToFinanceUtc(
        DateOnly date,
        TimeOnly time,
        TimeZoneInfo timeZone)
    {
        var localDateTime = date.ToDateTime(time, DateTimeKind.Unspecified);
        return new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(localDateTime, timeZone));
    }

    private static string FinanceCategoryLabel(string category) => category switch
    {
        "courtRental" => "Thuê sân",
        "membership" => "Gói hội viên",
        "class" => "Lớp học",
        "retail" => "Bán lẻ",
        "service" => "Dịch vụ",
        "equipmentRental" => "Thuê dụng cụ",
        "surcharge" => "Phụ thu",
        "discount" => "Giảm giá / ưu đãi",
        "refund" => "Hoàn tiền",
        "inventory" => "Nhập hàng / kho",
        "salary" => "Lương",
        "coachCommission" => "Hoa hồng HLV",
        "maintenance" => "Bảo trì",
        "utilities" => "Điện nước",
        "operating" => "Chi phí vận hành",
        "debtPayment" => "Thanh toán công nợ",
        "coachDebt" => "Công nợ HLV",
        _ => "Khác"
    };

    private static string NormalizeCounterpartyType(string? value) => value switch
    {
        "booking" or "member" or "coach" or "supplier" => value,
        _ => "other"
    };

    private static string DebtReference(Guid debtId) => $"DEBT:{debtId:N}";
    private static string CoachDebtReference(Guid debtId) => $"COACH-DEBT:{debtId:N}";
}

public sealed record AdminFinanceOperationsResponse(
    string Period,
    AdminFinanceSummaryResponse Summary,
    IReadOnlyCollection<AdminFinanceSourceResponse> Sources,
    IReadOnlyCollection<AdminFinanceOperationTransactionResponse> Transactions,
    AdminFinanceDebtSummaryResponse DebtSummary,
    IReadOnlyCollection<AdminFinanceDebtResponse> Debts,
    IReadOnlyCollection<AdminFinanceOperationTransactionResponse> ReconciliationItems);

public sealed record AdminFinanceSummaryResponse(
    decimal Revenue,
    decimal Expense,
    decimal Refunds,
    decimal NetReceived,
    decimal Difference,
    int UnresolvedCount)
{
    public decimal Collected => NetReceived;
    public decimal Profit => Revenue - Expense - Refunds;
}

public sealed record AdminFinanceSourceResponse(
    string Category,
    string Label,
    decimal Amount,
    decimal Percentage);

public sealed record AdminFinanceOperationTransactionResponse(
    Guid Id,
    string Code,
    string Date,
    string Type,
    string Category,
    string CategoryLabel,
    string Counterparty,
    string Description,
    decimal Amount,
    decimal? ActualAmount,
    decimal Difference,
    string Method,
    string ReconciliationStatus,
    string? ReferenceCode,
    string BranchName,
    string CreatedBy,
    string? ConfirmedBy,
    string? ConfirmedAt);

public sealed record AdminFinanceDebtSummaryResponse(
    decimal Receivable,
    decimal Payable,
    int OverdueCount);

public sealed record AdminFinanceDebtResponse(
    Guid Id,
    string Direction,
    string CounterpartyType,
    string Counterparty,
    string Description,
    decimal Amount,
    decimal PaidAmount,
    decimal OutstandingAmount,
    string DueDate,
    string Status,
    string? SourceType,
    Guid? SourceId);

public sealed record CreateFinanceEntryRequest(
    string Type,
    string Category,
    string Counterparty,
    decimal Amount,
    string Method,
    string? Date,
    string? ReferenceCode,
    string? Note,
    string BranchName = "Cơ sở chính");

public sealed record CreateFinanceDebtRequest(
    string Direction,
    string Counterparty,
    string Description,
    decimal Amount,
    string DueDate,
    string CounterpartyType = "other",
    string? SourceType = null,
    Guid? SourceId = null);

public sealed record ReconcileFinanceEntryRequest(decimal ActualAmount);

public sealed record AdminDebtsResponse(
    decimal TotalReceivable,
    decimal TotalPayable,
    decimal DueSoonAmount,
    decimal OverdueAmount,
    decimal PartialAmount,
    IReadOnlyCollection<AdminDebtResponse> Debts);

public sealed record AdminDebtResponse(
    Guid Id,
    string Direction,
    string CounterpartyType,
    string Counterparty,
    string Description,
    string IncurredDate,
    string DueDate,
    decimal Amount,
    decimal PaidAmount,
    decimal OutstandingAmount,
    string Status,
    string? SourceType,
    Guid? SourceId,
    IReadOnlyCollection<AdminDebtPaymentResponse> Payments);

public sealed record AdminDebtPaymentResponse(
    Guid Id,
    string Code,
    decimal Amount,
    string Method,
    string PaidAt);

public sealed record RecordDebtPaymentRequest(
    decimal Amount,
    string Method,
    string? Note);

internal sealed record FinanceOperationRow(
    Guid Id,
    string Code,
    DateTimeOffset OccurredAtUtc,
    string Type,
    string Category,
    string Counterparty,
    string Description,
    decimal Amount,
    decimal? ActualAmount,
    string Method,
    string ReconciliationStatus,
    string? ReferenceCode,
    string BranchName,
    string CreatedBy,
    string? ConfirmedBy,
    DateTimeOffset? ConfirmedAtUtc);
