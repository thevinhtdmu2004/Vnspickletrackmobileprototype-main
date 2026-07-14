using System.Data;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Application.Common;
using Vns.PickleTrack.Application.Routes;
using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Infrastructure.Persistence;

namespace Vns.PickleTrack.Api.Endpoints;

public static partial class AdminEndpoints
{
    private static async Task<IResult> GetStaffOperationsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
        var today = DateOnly.FromDateTime(localNow.Date);
        var startUtc = ToUtc(today, TimeOnly.MinValue, timeZone);
        var endUtc = ToUtc(today.AddDays(1), TimeOnly.MinValue, timeZone);
        var shifts = await dbContext.StaffShifts.AsNoTracking()
            .Where(item => item.StartsAtUtc >= startUtc && item.StartsAtUtc < endUtc)
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var handovers = await dbContext.ShiftHandovers.AsNoTracking()
            .OrderByDescending(item => item.CompletedAtUtc)
            .Take(20)
            .ToListAsync(cancellationToken);

        var rows = shifts.Select(item =>
        {
            var start = TimeZoneInfo.ConvertTime(item.StartsAtUtc, timeZone);
            var end = TimeZoneInfo.ConvertTime(item.EndsAtUtc, timeZone);
            var status = item.Status == "absent" ? "absent" :
                item.Status == "handedOver" ? "handedOver" :
                item.StartsAtUtc <= DateTimeOffset.UtcNow && item.EndsAtUtc > DateTimeOffset.UtcNow ? "onDuty" :
                item.StartsAtUtc > DateTimeOffset.UtcNow ? "upcoming" : item.Status;
            return new AdminStaffShiftResponse(item.Id, item.StaffName, start.ToString("HH:mm"), end.ToString("HH:mm"), status);
        }).ToArray();
        var next = rows.FirstOrDefault(item => item.Status == "upcoming");
        return Results.Ok(ApiEnvelope<AdminStaffOperationsResponse>.Ok(
            new AdminStaffOperationsResponse(
                rows.Count(item => item.Status == "onDuty"),
                rows.Count(item => item.Status == "absent"),
                next is null ? null : $"{next.StartTime} - {next.EndTime}",
                rows,
                handovers.Select(item => new AdminShiftHandoverResponse(
                    item.Id,
                    item.ShiftId,
                    item.HandedOverBy,
                    item.ReceivedBy,
                    item.OpeningCash,
                    item.ClosingCash,
                    item.InventoryChecked,
                    item.IncidentNote,
                    TimeZoneInfo.ConvertTime(item.CompletedAtUtc, timeZone).ToString("dd/MM/yyyy HH:mm"))).ToArray())));
    }

    private static async Task<IResult> CreateShiftHandoverAsync(
        CreateShiftHandoverRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.OpeningCash < 0 || request.ClosingCash < 0 ||
            string.IsNullOrWhiteSpace(request.HandedOverBy) ||
            string.IsNullOrWhiteSpace(request.ReceivedBy) ||
            request.HandedOverBy.Trim().Equals(request.ReceivedBy.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Thông tin bàn giao chưa hợp lệ.",
                new ApiError("INVALID_HANDOVER", "receivedBy", "Người giao và người nhận phải khác nhau; số tiền không được âm.")));
        }

        var shift = await dbContext.StaffShifts.SingleOrDefaultAsync(item => item.Id == request.ShiftId, cancellationToken);
        if (shift is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy ca trực.",
                new ApiError("SHIFT_NOT_FOUND", "shiftId", "Ca trực không tồn tại.")));
        }

        var exists = await dbContext.ShiftHandovers.AnyAsync(item => item.ShiftId == request.ShiftId, cancellationToken);
        if (exists)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Ca trực đã được bàn giao.",
                new ApiError("HANDOVER_EXISTS", "shiftId", "Không thể bàn giao cùng một ca hai lần.")));
        }

        var handover = new ShiftHandover(
            shift.Id,
            request.HandedOverBy.Trim(),
            request.ReceivedBy.Trim(),
            request.OpeningCash,
            request.ClosingCash,
            request.InventoryChecked,
            string.IsNullOrWhiteSpace(request.IncidentNote) ? null : request.IncidentNote.Trim(),
            DateTimeOffset.UtcNow);
        shift.MarkHandedOver();
        await dbContext.ShiftHandovers.AddAsync(handover, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created(
            $"{ApiRoutes.Root}/admin/shift-handovers/{handover.Id}",
            ApiEnvelope<object>.Ok(new { handover.Id }, "Đã xác nhận bàn giao ca."));
    }

    private static async Task<IResult> CreateStaffShiftAsync(
        CreateStaffShiftRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var staff = request.StaffUserId.HasValue
            ? await dbContext.Users.AsNoTracking().SingleOrDefaultAsync(
                item => item.Id == request.StaffUserId.Value &&
                        item.Role == Vns.PickleTrack.Domain.Enums.UserRole.Admin &&
                        item.IsActive,
                cancellationToken)
            : null;
        if (staff is null ||
            !DateOnly.TryParseExact(request.Date, "yyyy-MM-dd", out var date) ||
            !TimeOnly.TryParseExact(request.StartTime, "HH:mm", out var startTime) ||
            !TimeOnly.TryParseExact(request.EndTime, "HH:mm", out var endTime) ||
            endTime <= startTime)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Thông tin ca trực chưa hợp lệ.",
                new ApiError("INVALID_SHIFT", "startTime", "Tên, ngày và khung giờ ca trực là bắt buộc.")));
        }
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var startsAtUtc = ToUtc(date, startTime, timeZone);
        var endsAtUtc = ToUtc(date, endTime, timeZone);
        var overlaps = await dbContext.StaffShifts.AnyAsync(item =>
            item.StaffName == staff.DisplayName &&
            item.Status != "absent" &&
            item.StartsAtUtc < endsAtUtc &&
            item.EndsAtUtc > startsAtUtc,
            cancellationToken);
        if (overlaps)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Nhân viên đã có ca trong khung giờ này.",
                new ApiError("SHIFT_OVERLAP", "startTime", "Hãy chọn khung giờ khác.")));
        }
        var shift = new StaffShift(staff.DisplayName, startsAtUtc, endsAtUtc, request.Status == "absent" ? "absent" : "scheduled");
        await dbContext.StaffShifts.AddAsync(shift, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created($"{ApiRoutes.Root}/admin/staff-shifts/{shift.Id}", ApiEnvelope<object>.Ok(new { shift.Id }));
    }

    private static async Task<IResult> GetInventoryOperationsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var items = await dbContext.InventoryItems.AsNoTracking().OrderBy(item => item.Name).ToListAsync(cancellationToken);
        var movements = await dbContext.InventoryMovements.AsNoTracking()
            .OrderByDescending(item => item.CreatedAtUtc)
            .Take(30)
            .ToListAsync(cancellationToken);
        var bookingCodes = movements
            .Where(item => item.ReferenceCode.StartsWith("BK-"))
            .Select(item => item.ReferenceCode.Split(':', 2)[0])
            .Distinct()
            .ToArray();
        var bookingByCode = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => bookingCodes.Contains(item.BookingCode))
            .ToDictionaryAsync(item => item.BookingCode, cancellationToken);
        var itemNames = items.ToDictionary(item => item.Id, item => item.Name);
        var bookings = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => item.Status != "cancelled" && item.EndsAtUtc >= DateTimeOffset.UtcNow.AddDays(-1))
            .OrderByDescending(item => item.StartsAtUtc)
            .Take(20)
            .Select(item => new AdminPosBookingResponse(item.Id, item.CustomerName, item.Amount))
            .ToListAsync(cancellationToken);
        var rows = items.Select(item => new AdminInventoryItemResponse(
            item.Id,
            item.Sku,
            item.Name,
            item.Category,
            item.SalePrice,
            item.CostPrice,
            item.Quantity,
            item.ReorderLevel,
            item.RentalTotal,
            item.RentalInUse,
            item.Quantity == 0 ? "outOfStock" : item.Quantity <= item.ReorderLevel ? "lowStock" : "inStock")).ToArray();
        return Results.Ok(ApiEnvelope<AdminInventoryOperationsResponse>.Ok(
            new AdminInventoryOperationsResponse(
                rows.Length,
                rows.Sum(item => item.CostPrice * item.Quantity),
                rows.Count(item => item.Status == "lowStock"),
                rows.Count(item => item.Status == "outOfStock"),
                rows,
                bookings,
                movements.Select(item => new AdminInventoryMovementResponse(
                    item.Id,
                    itemNames.GetValueOrDefault(item.InventoryItemId) ?? "Hàng hóa",
                    item.MovementType,
                    item.QuantityChange,
                    item.ReferenceCode,
                    item.CreatedAtUtc,
                    bookingByCode.GetValueOrDefault(item.ReferenceCode.Split(':', 2)[0])?.Id)).ToArray())));
    }

    private static async Task<IResult> RestockInventoryItemAsync(
        Guid id,
        RestockInventoryRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Quantity <= 0)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số lượng nhập phải lớn hơn 0.",
                new ApiError("INVALID_QUANTITY", "quantity", "Số lượng nhập không hợp lệ.")));
        }
        var item = await dbContext.InventoryItems.SingleOrDefaultAsync(row => row.Id == id, cancellationToken);
        if (item is null) return Results.NotFound();
        var unitCost = request.UnitCost > 0 ? request.UnitCost : item.CostPrice;
        var referenceCode = $"NK-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";
        item.AddStock(request.Quantity, unitCost);
        await dbContext.InventoryMovements.AddAsync(new InventoryMovement(
            item.Id,
            "restock",
            request.Quantity,
            unitCost,
            referenceCode,
            principal.Identity?.Name ?? "Admin"), cancellationToken);

        var totalCost = request.Quantity * unitCost;
        if (request.PaymentStatus == "debt")
        {
            await dbContext.FinanceDebts.AddAsync(new FinanceDebt(
                "payable",
                string.IsNullOrWhiteSpace(request.Supplier) ? "Nhà cung cấp" : request.Supplier.Trim(),
                $"Nhập kho {item.Name}",
                totalCost,
                0,
                DateTimeOffset.UtcNow.AddDays(7),
                "inventoryRestock",
                item.Id,
                "supplier"), cancellationToken);
        }
        else
        {
            var method = request.PaymentMethod is "cash" or "transfer" or "card"
                ? request.PaymentMethod
                : "other";
            await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
                $"PC-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}",
                "expense",
                "inventory",
                string.IsNullOrWhiteSpace(request.Supplier) ? "Nhà cung cấp" : request.Supplier.Trim(),
                totalCost,
                method,
                DateTimeOffset.UtcNow,
                referenceCode,
                $"Nhập {request.Quantity} {item.Name}",
                "reconciled",
                totalCost,
                createdBy: principal.Identity?.Name ?? "Admin"), cancellationToken);
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(
            new { item.Id, item.Quantity, UnitCost = unitCost, TotalCost = totalCost, ReferenceCode = referenceCode },
            "Đã nhập kho và ghi nhận tài chính."));
    }

    private static async Task<IResult> CountInventoryItemAsync(
        Guid id,
        CountInventoryRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Quantity < 0)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số lượng kiểm kê không được âm.",
                new ApiError("INVALID_QUANTITY", "quantity", "Số lượng kiểm kê không hợp lệ.")));
        }
        var item = await dbContext.InventoryItems.SingleOrDefaultAsync(row => row.Id == id, cancellationToken);
        if (item is null) return Results.NotFound();
        var difference = request.Quantity - item.Quantity;
        item.SetQuantity(request.Quantity);
        if (difference != 0)
        {
            await dbContext.InventoryMovements.AddAsync(new InventoryMovement(
                item.Id,
                "stocktake",
                difference,
                item.CostPrice,
                $"KK-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}",
                principal.Identity?.Name ?? "Admin"), cancellationToken);
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new { item.Id, item.Quantity }, "Đã ghi nhận kiểm kê."));
    }

    private static async Task<IResult> CreatePosSaleAsync(
        CreatePosSaleRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Items.Count == 0 ||
            request.Items.Any(item => item.Quantity <= 0) ||
            string.IsNullOrWhiteSpace(request.IdempotencyKey))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Giỏ hàng chưa hợp lệ.",
                new ApiError("INVALID_CART", "items", "Giỏ hàng phải có sản phẩm với số lượng hợp lệ.")));
        }

        var existingSale = await dbContext.PosSales.AsNoTracking()
            .SingleOrDefaultAsync(
                item => item.IdempotencyKey == request.IdempotencyKey.Trim(),
                cancellationToken);
        if (existingSale is not null)
        {
            return Results.Ok(ApiEnvelope<object>.Ok(
                new
                {
                    existingSale.Id,
                    existingSale.Code,
                    existingSale.TotalAmount,
                    existingSale.CostAmount,
                    existingSale.PaymentStatus
                },
                "Giao dịch đã được ghi nhận trước đó."));
        }
        CourtBooking? linkedBooking = null;
        if (request.BookingId.HasValue)
        {
            linkedBooking = await dbContext.CourtBookings.SingleOrDefaultAsync(
                item => item.Id == request.BookingId.Value,
                cancellationToken);
            if (linkedBooking is null)
            {
                return Results.BadRequest(ApiEnvelope<object>.Fail(
                    "Booking liên kết không tồn tại.",
                    new ApiError("BOOKING_NOT_FOUND", "bookingId", "Hãy chọn booking hợp lệ.")));
            }
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
        var ids = request.Items.Select(item => item.ItemId).Distinct().ToArray();
        var inventory = await dbContext.InventoryItems.Where(item => ids.Contains(item.Id)).ToListAsync(cancellationToken);
        if (inventory.Count != ids.Length)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Có sản phẩm không tồn tại.",
                new ApiError("ITEM_NOT_FOUND", "items", "Hãy tải lại danh sách sản phẩm.")));
        }

        var saleRows = new List<PosSaleLine>();
        foreach (var input in request.Items.GroupBy(item => item.ItemId).Select(group => new { ItemId = group.Key, Quantity = group.Sum(item => item.Quantity) }))
        {
            var item = inventory.Single(row => row.Id == input.ItemId);
            var removed = item.Category == "rental"
                ? item.TryCheckoutRental(input.Quantity)
                : item.TryRemoveStock(input.Quantity);
            if (!removed)
            {
                return Results.Conflict(ApiEnvelope<object>.Fail(
                    $"Không đủ tồn kho cho {item.Name}.",
                    new ApiError("INSUFFICIENT_STOCK", "items", $"Chỉ còn {item.Quantity} sản phẩm.")));
            }
            saleRows.Add(new PosSaleLine(
                item.Id,
                item.Name,
                input.Quantity,
                item.SalePrice,
                item.SalePrice * input.Quantity,
                item.CostPrice));
        }

        var total = saleRows.Sum(item => item.LineTotal);
        var totalCost = saleRows.Sum(item => item.UnitCost * item.Quantity);
        var code = $"POS-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";
        var method = request.PaymentMethod is "cash" or "transfer" or "card"
            ? request.PaymentMethod
            : "other";
        var sale = new PosSale(
            code,
            request.BookingId,
            total,
            totalCost,
            JsonSerializer.Serialize(saleRows),
            request.BookingId.HasValue ? "invoice" : method,
            request.BookingId.HasValue ? "invoiced" : "paid",
            request.IdempotencyKey.Trim());
        await dbContext.PosSales.AddAsync(sale, cancellationToken);
        foreach (var line in saleRows)
        {
            await dbContext.InventoryMovements.AddAsync(new InventoryMovement(
                line.ItemId,
                "sale",
                -line.Quantity,
                line.UnitCost,
                linkedBooking is null ? code : $"{linkedBooking.BookingCode}:{code}",
                principal.Identity?.Name ?? "Admin"), cancellationToken);
        }
        if (!request.BookingId.HasValue)
        {
            await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
                $"PT-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}",
                "income",
                "retail",
                "Khách vãng lai",
                total,
                method,
                DateTimeOffset.UtcNow,
                code,
                "Thanh toán POS",
                "reconciled",
                total,
                createdBy: principal.Identity?.Name ?? "Admin"), cancellationToken);
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        if (request.BookingId.HasValue)
        {
            await SyncBookingDebtAsync(request.BookingId.Value, dbContext, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        await transaction.CommitAsync(cancellationToken);
        return Results.Created(
            $"{ApiRoutes.Root}/admin/pos-sales/{sale.Id}",
            ApiEnvelope<object>.Ok(
                new { sale.Id, sale.Code, sale.TotalAmount, sale.CostAmount, sale.PaymentStatus },
                request.BookingId.HasValue
                    ? "Đã thêm vào hóa đơn booking và trừ tồn kho."
                    : "Đã thanh toán POS và trừ tồn kho."));
    }

    private static async Task<IResult> AddCourtBookingChargeAsync(
        Guid id,
        CreateBookingChargeRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.ChargeType is not ("service" or "rental" or "surcharge" or "discount") ||
            string.IsNullOrWhiteSpace(request.Description) ||
            request.Quantity <= 0 ||
            request.UnitAmount < 0)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Chi phí phát sinh không hợp lệ.",
                new ApiError("INVALID_BOOKING_CHARGE", "chargeType", "Kiểm tra loại phí, nội dung, số lượng và đơn giá.")));
        }
        if (!await dbContext.CourtBookings.AnyAsync(item => item.Id == id, cancellationToken))
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy booking.",
                new ApiError("BOOKING_NOT_FOUND", "id", "Booking không tồn tại.")));
        }

        var charge = new BookingCharge(id, request.ChargeType, request.Description, request.Quantity, request.UnitAmount);
        await dbContext.BookingCharges.AddAsync(charge, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        await SyncBookingDebtAsync(id, dbContext, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Created(
            $"{ApiRoutes.Root}/admin/court-bookings/{id}/charges/{charge.Id}",
            ApiEnvelope<object>.Ok(new { charge.Id, charge.TotalAmount }, "Đã cập nhật hóa đơn booking."));
    }

    private static async Task<IResult> RecordCourtBookingPaymentAsync(
        Guid id,
        RecordBookingPaymentRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var booking = await dbContext.CourtBookings.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (booking is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy booking.",
                new ApiError("BOOKING_NOT_FOUND", "id", "Booking không tồn tại.")));
        }

        var total = await CalculateBookingTotalAsync(id, booking.Amount, dbContext, cancellationToken);
        var outstanding = Math.Max(0, total - booking.PaidAmount);
        if (request.Amount <= 0 || request.Amount > outstanding)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số tiền thanh toán không hợp lệ.",
                new ApiError("INVALID_BOOKING_PAYMENT", "amount", "Số tiền không được vượt quá số còn nợ.")));
        }

        var method = request.Method is "cash" or "transfer" or "card" ? request.Method : "other";
        var localNow = TimeZoneInfo.ConvertTime(
            DateTimeOffset.UtcNow,
            TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"));
        var receiptCode = $"PT-{localNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";
        booking.RecordPayment(request.Amount, method, receiptCode);
        await dbContext.BookingPayments.AddAsync(new BookingPayment(
            booking.Id,
            receiptCode,
            request.Amount,
            method,
            DateTimeOffset.UtcNow,
            principal.Identity?.Name ?? "Admin"), cancellationToken);

        var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(
            item => item.SourceType == "courtBooking" && item.SourceId == id,
            cancellationToken);
        if (debt is null)
        {
            debt = new FinanceDebt(
                "receivable",
                booking.CustomerName,
                $"Hóa đơn booking BK-{booking.Id.ToString()[..8].ToUpperInvariant()}",
                total,
                request.Amount,
                booking.EndsAtUtc.AddDays(7),
                "courtBooking",
                booking.Id,
                "booking");
            await dbContext.FinanceDebts.AddAsync(debt, cancellationToken);
        }
        else
        {
            debt.SyncAmount(total);
            debt.RecordPayment(request.Amount);
        }

        await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
            receiptCode,
            "income",
            "courtRental",
            booking.CustomerName,
            request.Amount,
            method,
            DateTimeOffset.UtcNow,
            $"BOOKING:{booking.Id:N}",
            string.IsNullOrWhiteSpace(request.Note) ? "Thanh toán hóa đơn booking" : request.Note.Trim(),
            "reconciled",
            request.Amount,
            createdBy: principal.Identity?.Name ?? "Admin"), cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Ok(ApiEnvelope<object>.Ok(new
        {
            booking.Id,
            booking.PaidAmount,
            OutstandingAmount = Math.Max(0, total - booking.PaidAmount),
            ReceiptCode = receiptCode
        }, "Đã ghi nhận thanh toán booking."));
    }

    private static async Task<IResult> RecordCourtBookingRefundAsync(
        Guid id,
        RecordBookingRefundRequest request,
        ClaimsPrincipal principal,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var booking = await dbContext.CourtBookings.SingleOrDefaultAsync(
            item => item.Id == id,
            cancellationToken);
        if (booking is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy booking.",
                new ApiError("BOOKING_NOT_FOUND", "id", "Booking không tồn tại.")));
        }
        if (request.Amount <= 0 || request.Amount > booking.PaidAmount)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Số tiền hoàn không hợp lệ.",
                new ApiError("INVALID_REFUND", "amount", "Số tiền hoàn không được vượt quá số thực thu.")));
        }

        var method = request.Method is "cash" or "transfer" or "card" ? request.Method : "other";
        var refundCode = $"HT-{DateTimeOffset.UtcNow:yyMMdd}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";
        booking.RecordRefund(request.Amount);
        await dbContext.BookingPayments.AddAsync(new BookingPayment(
            booking.Id,
            refundCode,
            request.Amount,
            method,
            DateTimeOffset.UtcNow,
            principal.Identity?.Name ?? "Admin",
            "refund",
            request.Note), cancellationToken);

        var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(
            item => item.SourceType == "courtBooking" && item.SourceId == booking.Id,
            cancellationToken);
        debt?.RecordRefund(request.Amount);

        await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
            refundCode,
            "refund",
            "refund",
            booking.CustomerName,
            request.Amount,
            method,
            DateTimeOffset.UtcNow,
            $"BOOKING:{booking.Id:N}",
            string.IsNullOrWhiteSpace(request.Note)
                ? $"Hoàn tiền {booking.BookingCode}"
                : request.Note.Trim(),
            "pending",
            createdBy: principal.Identity?.Name ?? "Admin"), cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var total = await CalculateBookingTotalAsync(id, booking.Amount, dbContext, cancellationToken);
        return Results.Ok(ApiEnvelope<object>.Ok(new
        {
            booking.Id,
            booking.BookingCode,
            RefundCode = refundCode,
            booking.PaidAmount,
            OutstandingAmount = Math.Max(0, total - booking.PaidAmount)
        }, "Đã ghi nhận hoàn tiền booking."));
    }

    private static async Task<IResult> GetCourtBookingInvoiceAsync(
        Guid id,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var booking = await (
            from item in dbContext.CourtBookings.AsNoTracking()
            join court in dbContext.Courts.AsNoTracking() on item.CourtId equals court.Id
            where item.Id == id
            select new
            {
                item.Id,
                item.BookingCode,
                item.CustomerName,
                item.CustomerPhone,
                item.CustomerType,
                item.Status,
                item.StartsAtUtc,
                item.EndsAtUtc,
                item.Amount,
                item.CourtAmountBeforeBenefit,
                item.CourtBenefitDiscount,
                item.AppliedMembershipRenewalId,
                item.MembershipPackageName,
                item.MembershipBenefitExpiresAtUtc,
                item.MembershipBenefitUsesRemainingAfterApply,
                item.MembershipBenefitNote,
                item.PaidAmount,
                item.PaymentMethod,
                item.ReceiptCode,
                CourtName = court.Name
            })
            .SingleOrDefaultAsync(cancellationToken);
        if (booking is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "KhÃ´ng tÃ¬m tháº¥y booking.",
                new ApiError("BOOKING_NOT_FOUND", "id", "Booking khÃ´ng tá»“n táº¡i.")));
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var sales = await dbContext.PosSales.AsNoTracking()
            .Where(item => item.BookingId == id)
            .OrderBy(item => item.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        var saleRows = sales.Select(sale =>
        {
            IReadOnlyCollection<PosSaleLine> items;
            try
            {
                items = JsonSerializer.Deserialize<PosSaleLine[]>(sale.ItemsJson) ?? [];
            }
            catch (JsonException)
            {
                items = [];
            }

            return new AdminBookingInvoiceSaleResponse(
                sale.Id,
                sale.Code,
                TimeZoneInfo.ConvertTime(sale.CreatedAtUtc, timeZone).ToString("dd/MM/yyyy HH:mm"),
                sale.TotalAmount,
                items.Select(item => new AdminBookingInvoiceItemResponse(
                    item.ItemId,
                    item.Name,
                    item.Quantity,
                    item.UnitPrice,
                    item.LineTotal)).ToArray());
        }).ToArray();
        var localStart = TimeZoneInfo.ConvertTime(booking.StartsAtUtc, timeZone);
        var localEnd = TimeZoneInfo.ConvertTime(booking.EndsAtUtc, timeZone);
        var posAmount = saleRows.Sum(item => item.TotalAmount);
        var charges = await dbContext.BookingCharges.AsNoTracking()
            .Where(item => item.BookingId == id)
            .OrderBy(item => item.CreatedAtUtc)
            .Select(item => new AdminBookingChargeResponse(
                item.Id,
                item.ChargeType,
                item.Description,
                item.Quantity,
                item.UnitAmount,
                item.Quantity * item.UnitAmount))
            .ToArrayAsync(cancellationToken);
        var serviceAmount = charges.Where(item => item.ChargeType == "service").Sum(item => item.TotalAmount);
        var rentalAmount = charges.Where(item => item.ChargeType == "rental").Sum(item => item.TotalAmount);
        var surchargeAmount = charges.Where(item => item.ChargeType == "surcharge").Sum(item => item.TotalAmount);
        var discountAmount = charges.Where(item => item.ChargeType == "discount").Sum(item => item.TotalAmount);
        var subtotal = booking.Amount + posAmount + serviceAmount + rentalAmount + surchargeAmount;
        var total = Math.Max(0, subtotal - discountAmount);
        var outstandingAmount = Math.Max(0, total - booking.PaidAmount);
        var debtId = await dbContext.FinanceDebts.AsNoTracking()
            .Where(item => item.SourceType == "courtBooking" && item.SourceId == id)
            .Select(item => (Guid?)item.Id)
            .SingleOrDefaultAsync(cancellationToken);
        var payments = await dbContext.BookingPayments.AsNoTracking()
            .Where(item => item.BookingId == id)
            .OrderByDescending(item => item.PaidAtUtc)
            .Select(item => new AdminBookingPaymentResponse(
                item.Id,
                item.ReceiptCode,
                item.Amount,
                item.Method,
                TimeZoneInfo.ConvertTime(item.PaidAtUtc, timeZone).ToString("dd/MM/yyyy HH:mm"),
                item.CreatedBy,
                item.TransactionType,
                item.Note))
            .ToArrayAsync(cancellationToken);
        var financeEntries = await dbContext.FinanceEntries.AsNoTracking()
            .Where(item => item.ReferenceCode == $"BOOKING:{id:N}")
            .OrderByDescending(item => item.OccurredAtUtc)
            .Select(item => new AdminBookingFinanceEntryResponse(
                item.Id,
                item.Code,
                item.Type,
                item.Amount,
                item.Method,
                item.ReconciliationStatus,
                TimeZoneInfo.ConvertTime(item.OccurredAtUtc, timeZone).ToString("dd/MM/yyyy HH:mm")))
            .ToArrayAsync(cancellationToken);

        return Results.Ok(ApiEnvelope<AdminBookingInvoiceResponse>.Ok(
            new AdminBookingInvoiceResponse(
                booking.Id,
                booking.BookingCode,
                booking.CourtName,
                booking.CustomerName,
                booking.CustomerPhone,
                booking.CustomerType,
                booking.Status,
                localStart.ToString("dd/MM/yyyy"),
                $"{localStart:HH:mm} - {localEnd:HH:mm}",
                booking.Amount,
                booking.CourtAmountBeforeBenefit,
                booking.CourtBenefitDiscount,
                booking.AppliedMembershipRenewalId is not null,
                booking.MembershipPackageName,
                booking.MembershipBenefitExpiresAtUtc is null
                    ? null
                    : TimeZoneInfo.ConvertTime(booking.MembershipBenefitExpiresAtUtc.Value, timeZone).ToString("dd/MM/yyyy"),
                booking.MembershipBenefitUsesRemainingAfterApply,
                booking.MembershipBenefitNote,
                posAmount,
                rentalAmount,
                serviceAmount,
                surchargeAmount,
                subtotal,
                discountAmount,
                total,
                booking.PaidAmount,
                outstandingAmount,
                booking.PaymentMethod,
                outstandingAmount == 0 ? "paid" : booking.PaidAmount > 0 ? "partial" : "unpaid",
                booking.ReceiptCode,
                debtId,
                charges,
                saleRows,
                payments,
                financeEntries)));
    }

    private static async Task<decimal> CalculateBookingTotalAsync(
        Guid bookingId,
        decimal courtAmount,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var posAmount = await dbContext.PosSales
            .Where(item => item.BookingId == bookingId)
            .SumAsync(item => item.TotalAmount, cancellationToken);
        var charges = await dbContext.BookingCharges
            .Where(item => item.BookingId == bookingId)
            .Select(item => new { item.ChargeType, Total = item.Quantity * item.UnitAmount })
            .ToListAsync(cancellationToken);
        var additions = charges.Where(item => item.ChargeType != "discount").Sum(item => item.Total);
        var discounts = charges.Where(item => item.ChargeType == "discount").Sum(item => item.Total);
        return Math.Max(0, courtAmount + posAmount + additions - discounts);
    }

    private static async Task SyncBookingDebtAsync(
        Guid bookingId,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var booking = await dbContext.CourtBookings.SingleAsync(item => item.Id == bookingId, cancellationToken);
        var total = await CalculateBookingTotalAsync(bookingId, booking.Amount, dbContext, cancellationToken);
        var debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(
            item => item.SourceType == "courtBooking" && item.SourceId == bookingId,
            cancellationToken);
        if (debt is null)
        {
            await dbContext.FinanceDebts.AddAsync(new FinanceDebt(
                "receivable",
                booking.CustomerName,
                $"Hóa đơn booking BK-{booking.Id.ToString()[..8].ToUpperInvariant()}",
                total,
                booking.PaidAmount,
                booking.EndsAtUtc.AddDays(7),
                "courtBooking",
                booking.Id,
                "booking"), cancellationToken);
            return;
        }

        debt.SyncAmount(total);
    }

    private static async Task<IResult> GetExperienceOperationsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var now = DateTimeOffset.UtcNow;
        var contents = await dbContext.ContentItems.AsNoTracking().OrderByDescending(item => item.CreatedAtUtc).ToListAsync(cancellationToken);
        var promotions = await dbContext.Promotions.AsNoTracking().OrderBy(item => item.StartsAtUtc).ToListAsync(cancellationToken);
        var packages = await dbContext.Packages.AsNoTracking().Where(item => item.IsActive).OrderBy(item => item.Name).ToListAsync(cancellationToken);
        var packageNames = packages.ToDictionary(item => item.Id, item => item.Name);
        var lowStock = await dbContext.InventoryItems.AsNoTracking()
            .Where(item => item.Quantity <= item.ReorderLevel)
            .OrderBy(item => item.Quantity)
            .Take(5)
            .ToListAsync(cancellationToken);
        var bookingRows = await dbContext.CourtBookings.AsNoTracking()
            .Where(item => item.Status != "cancelled" && item.StartsAtUtc >= now.AddDays(-1))
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var conflicts = bookingRows
            .GroupBy(item => item.CourtId)
            .SelectMany(group => group.SelectMany((left, index) => group.Skip(index + 1)
                .Where(right => left.StartsAtUtc < right.EndsAtUtc && left.EndsAtUtc > right.StartsAtUtc)
                .Select(right => new { left, right })))
            .Take(3)
            .ToArray();
        var alerts = conflicts.Select(item => new AdminSystemAlertResponse(
                "bookingConflict",
                "critical",
                "Xung đột lịch đặt sân",
                $"Hai booking trùng giờ từ {item.left.StartsAtUtc:HH:mm}."))
            .Concat(lowStock.Select(item => new AdminSystemAlertResponse(
                "lowStock",
                item.Quantity == 0 ? "critical" : "warning",
                item.Quantity == 0 ? "Hết hàng" : "Tồn kho sắp hết",
                $"{item.Name} chỉ còn {item.Quantity}.")))
            .ToArray();

        return Results.Ok(ApiEnvelope<AdminExperienceOperationsResponse>.Ok(
            new AdminExperienceOperationsResponse(
                contents.Select(item => new AdminContentItemResponse(
                    item.Id,
                    item.Title,
                    item.ContentType,
                    item.Status,
                    item.PackageId,
                    item.PackageId.HasValue && packageNames.TryGetValue(item.PackageId.Value, out var packageName)
                        ? packageName
                        : null,
                    item.Summary,
                    item.CreatedByName,
                    item.CreatedAtUtc,
                    item.ReviewedByName,
                    item.ReviewedAtUtc,
                    item.RejectionReason)).ToArray(),
                promotions.Select(item => new AdminPromotionResponse(
                    item.Id,
                    item.Name,
                    item.MemberGroup,
                    item.BenefitType,
                    item.BenefitValue,
                    item.StartsAtUtc.ToString("yyyy-MM-dd"),
                    item.EndsAtUtc.ToString("yyyy-MM-dd"),
                    item.Conditions,
                    item.EndsAtUtc < now ? "ended" : item.StartsAtUtc > now ? "upcoming" : "active")).ToArray(),
                packages.Select(item => new AdminExperiencePackageResponse(item.Id, item.Name)).ToArray(),
                alerts)));
    }

    private static async Task<IResult> CreateContentItemAsync(
        CreateContentItemRequest request,
        ClaimsPrincipal user,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Summary) ||
            request.ContentType is not ("rules" or "bookingPolicy" or "video" or "benefit"))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Nội dung chưa hợp lệ.",
                new ApiError("INVALID_CONTENT", "title", "Tiêu đề, nội dung và loại tài liệu là bắt buộc.")));
        }
        if (request.PackageId.HasValue &&
            !await dbContext.Packages.AnyAsync(item => item.Id == request.PackageId.Value && item.IsActive, cancellationToken))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Gói hội viên không hợp lệ.",
                new ApiError("PACKAGE_NOT_FOUND", "packageId", "Không tìm thấy gói hội viên.")));
        }
        var item = new ContentItem(
            request.Title.Trim(),
            request.ContentType,
            request.Status == "approved" ? "approved" : "pending",
            request.PackageId,
            request.Summary.Trim(),
            user.Identity?.Name ?? "Admin");
        await dbContext.ContentItems.AddAsync(item, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created($"{ApiRoutes.Root}/admin/content-items/{item.Id}", ApiEnvelope<object>.Ok(new { item.Id }));
    }

    private static async Task<IResult> CreatePromotionAsync(
        CreatePromotionRequest request,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.MemberGroup) ||
            request.BenefitType is not ("discount" or "bonusHours") || request.BenefitValue <= 0 ||
            !DateOnly.TryParseExact(request.StartDate, "yyyy-MM-dd", out var startDate) ||
            !DateOnly.TryParseExact(request.EndDate, "yyyy-MM-dd", out var endDate) ||
            endDate < startDate)
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Chương trình ưu đãi chưa hợp lệ.",
                new ApiError("INVALID_PROMOTION", "startDate", "Kiểm tra nhóm, loại ưu đãi, giá trị và thời gian hiệu lực.")));
        }
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var startsAtUtc = ToUtc(startDate, TimeOnly.MinValue, timeZone);
        var endsAtUtc = ToUtc(endDate.AddDays(1), TimeOnly.MinValue, timeZone).AddTicks(-1);
        var overlaps = await dbContext.Promotions.AnyAsync(item =>
            item.MemberGroup == request.MemberGroup &&
            item.BenefitType == request.BenefitType &&
            item.StartsAtUtc <= endsAtUtc &&
            item.EndsAtUtc >= startsAtUtc,
            cancellationToken);
        if (overlaps)
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Ưu đãi bị trùng điều kiện và thời gian.",
                new ApiError("PROMOTION_OVERLAP", "startDate", "Hãy đổi thời gian hoặc nhóm hội viên áp dụng.")));
        }
        var promotion = new Promotion(
            request.Name.Trim(),
            request.MemberGroup.Trim(),
            request.BenefitType,
            request.BenefitValue,
            startsAtUtc,
            endsAtUtc,
            string.IsNullOrWhiteSpace(request.Conditions) ? "Không có điều kiện bổ sung" : request.Conditions.Trim());
        await dbContext.Promotions.AddAsync(promotion, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Results.Created($"{ApiRoutes.Root}/admin/promotions/{promotion.Id}", ApiEnvelope<object>.Ok(new { promotion.Id }));
    }

    private static async Task<IResult> ReviewContentItemAsync(
        Guid id,
        ReviewContentItemRequest request,
        ClaimsPrincipal user,
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (request.Status is not ("approved" or "rejected"))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Trạng thái duyệt không hợp lệ.",
                new ApiError("INVALID_REVIEW_STATUS", "status", "Chỉ chấp nhận approved hoặc rejected.")));
        }
        if (request.Status == "rejected" && string.IsNullOrWhiteSpace(request.Reason))
        {
            return Results.BadRequest(ApiEnvelope<object>.Fail(
                "Vui lòng nhập lý do từ chối.",
                new ApiError("REJECTION_REASON_REQUIRED", "reason", "Lý do từ chối là bắt buộc.")));
        }

        var item = await dbContext.ContentItems.SingleOrDefaultAsync(row => row.Id == id, cancellationToken);
        if (item is null)
        {
            return Results.NotFound(ApiEnvelope<object>.Fail(
                "Không tìm thấy nội dung.",
                new ApiError("CONTENT_NOT_FOUND", "id", "Nội dung không tồn tại.")));
        }
        if (item.Status != "pending")
        {
            return Results.Conflict(ApiEnvelope<object>.Fail(
                "Nội dung đã được xử lý.",
                new ApiError("CONTENT_ALREADY_REVIEWED", "status", "Chỉ nội dung chờ duyệt mới có thể xử lý.")));
        }

        item.Review(request.Status, user.Identity?.Name ?? "Admin", request.Reason);
        await dbContext.SaveChangesAsync(cancellationToken);
        var packageName = item.PackageId.HasValue
            ? await dbContext.Packages
                .Where(package => package.Id == item.PackageId.Value)
                .Select(package => package.Name)
                .SingleOrDefaultAsync(cancellationToken)
            : null;
        return Results.Ok(ApiEnvelope<AdminContentItemResponse>.Ok(
            new AdminContentItemResponse(
                item.Id,
                item.Title,
                item.ContentType,
                item.Status,
                item.PackageId,
                packageName,
                item.Summary,
                item.CreatedByName,
                item.CreatedAtUtc,
                item.ReviewedByName,
                item.ReviewedAtUtc,
                item.RejectionReason),
            request.Status == "approved" ? "Đã duyệt nội dung." : "Đã từ chối nội dung."));
    }
}

public sealed record AdminStaffOperationsResponse(
    int OnDutyCount,
    int AbsentCount,
    string? NextShift,
    IReadOnlyCollection<AdminStaffShiftResponse> Shifts,
    IReadOnlyCollection<AdminShiftHandoverResponse> Handovers);
public sealed record AdminStaffShiftResponse(Guid Id, string StaffName, string StartTime, string EndTime, string Status);
public sealed record AdminShiftHandoverResponse(Guid Id, Guid ShiftId, string HandedOverBy, string ReceivedBy, decimal OpeningCash, decimal ClosingCash, bool InventoryChecked, string? IncidentNote, string CompletedAt);
public sealed record CreateShiftHandoverRequest(Guid ShiftId, string HandedOverBy, string ReceivedBy, decimal OpeningCash, decimal ClosingCash, bool InventoryChecked, string? IncidentNote);
public sealed record CreateStaffShiftRequest(Guid? StaffUserId, string Date, string StartTime, string EndTime, string Status);
public sealed record AdminInventoryOperationsResponse(
    int ItemCount,
    decimal StockValue,
    int LowStockCount,
    int OutOfStockCount,
    IReadOnlyCollection<AdminInventoryItemResponse> Items,
    IReadOnlyCollection<AdminPosBookingResponse> Bookings,
    IReadOnlyCollection<AdminInventoryMovementResponse> Movements);
public sealed record AdminInventoryItemResponse(Guid Id, string Sku, string Name, string Category, decimal SalePrice, decimal CostPrice, int Quantity, int ReorderLevel, int RentalTotal, int RentalInUse, string Status);
public sealed record AdminPosBookingResponse(Guid Id, string CustomerName, decimal Amount);
public sealed record AdminInventoryMovementResponse(Guid Id, string ItemName, string MovementType, int QuantityChange, string ReferenceCode, DateTimeOffset CreatedAtUtc, Guid? BookingId);
public sealed record RestockInventoryRequest(
    int Quantity,
    decimal UnitCost = 0,
    string PaymentMethod = "transfer",
    string PaymentStatus = "paid",
    string? Supplier = null);
public sealed record CountInventoryRequest(int Quantity);
public sealed record CreatePosSaleRequest(
    Guid? BookingId,
    IReadOnlyCollection<CreatePosSaleItemRequest> Items,
    string PaymentMethod = "cash",
    string IdempotencyKey = "");
public sealed record CreatePosSaleItemRequest(Guid ItemId, int Quantity);
internal sealed record PosSaleLine(
    Guid ItemId,
    string Name,
    int Quantity,
    decimal UnitPrice,
    decimal LineTotal,
    decimal UnitCost = 0);
public sealed record CreateBookingChargeRequest(string ChargeType, string Description, int Quantity, decimal UnitAmount);
public sealed record RecordBookingPaymentRequest(decimal Amount, string Method, string? Note);
public sealed record RecordBookingRefundRequest(decimal Amount, string Method, string? Note);
public sealed record AdminBookingInvoiceResponse(
    Guid BookingId,
    string BookingCode,
    string CourtName,
    string CustomerName,
    string CustomerPhone,
    string CustomerType,
    string BookingStatus,
    string Date,
    string TimeRange,
    decimal CourtAmount,
    decimal CourtAmountBeforeBenefit,
    decimal CourtBenefitDiscount,
    bool MembershipBenefitApplied,
    string? MembershipPackageName,
    string? MembershipBenefitExpiresAt,
    int? MembershipBenefitUsesRemainingAfterApply,
    string? MembershipBenefitNote,
    decimal PosAmount,
    decimal RentalAmount,
    decimal ServiceAmount,
    decimal SurchargeAmount,
    decimal Subtotal,
    decimal DiscountAmount,
    decimal TotalAmount,
    decimal PaidAmount,
    decimal OutstandingAmount,
    string? PaymentMethod,
    string PaymentStatus,
    string? ReceiptCode,
    Guid? DebtId,
    IReadOnlyCollection<AdminBookingChargeResponse> Charges,
    IReadOnlyCollection<AdminBookingInvoiceSaleResponse> Sales,
    IReadOnlyCollection<AdminBookingPaymentResponse> Payments,
    IReadOnlyCollection<AdminBookingFinanceEntryResponse> FinanceEntries);
public sealed record AdminBookingPaymentResponse(
    Guid Id,
    string ReceiptCode,
    decimal Amount,
    string Method,
    string PaidAt,
    string CreatedBy,
    string TransactionType,
    string? Note);
public sealed record AdminBookingChargeResponse(
    Guid Id,
    string ChargeType,
    string Description,
    int Quantity,
    decimal UnitAmount,
    decimal TotalAmount);
public sealed record AdminBookingInvoiceSaleResponse(
    Guid Id,
    string Code,
    string CreatedAt,
    decimal TotalAmount,
    IReadOnlyCollection<AdminBookingInvoiceItemResponse> Items);
public sealed record AdminBookingInvoiceItemResponse(
    Guid ItemId,
    string Name,
    int Quantity,
    decimal UnitPrice,
    decimal LineTotal);
public sealed record AdminBookingFinanceEntryResponse(
    Guid Id,
    string Code,
    string Type,
    decimal Amount,
    string Method,
    string ReconciliationStatus,
    string OccurredAt);
public sealed record AdminExperienceOperationsResponse(IReadOnlyCollection<AdminContentItemResponse> Contents, IReadOnlyCollection<AdminPromotionResponse> Promotions, IReadOnlyCollection<AdminExperiencePackageResponse> Packages, IReadOnlyCollection<AdminSystemAlertResponse> Alerts);
public sealed record AdminContentItemResponse(
    Guid Id,
    string Title,
    string ContentType,
    string Status,
    Guid? PackageId,
    string? PackageName,
    string Summary,
    string CreatedByName,
    DateTimeOffset CreatedAtUtc,
    string? ReviewedByName,
    DateTimeOffset? ReviewedAtUtc,
    string? RejectionReason);
public sealed record AdminPromotionResponse(Guid Id, string Name, string MemberGroup, string BenefitType, decimal BenefitValue, string StartDate, string EndDate, string Conditions, string Status);
public sealed record AdminExperiencePackageResponse(Guid Id, string Name);
public sealed record AdminSystemAlertResponse(string Type, string Severity, string Title, string Detail);
public sealed record CreateContentItemRequest(string Title, string ContentType, string Status, Guid? PackageId, string Summary);
public sealed record ReviewContentItemRequest(string Status, string? Reason);
public sealed record CreatePromotionRequest(string Name, string MemberGroup, string BenefitType, decimal BenefitValue, string StartDate, string EndDate, string? Conditions);
