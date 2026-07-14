using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Vns.PickleTrack.Domain.Entities;
using Vns.PickleTrack.Domain.Enums;

namespace Vns.PickleTrack.Infrastructure.Persistence;

internal static class DemoDataSeeder
{
    public static async Task SeedAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (!await dbContext.Users.AnyAsync(cancellationToken))
        {
            await SeedCorePrototypeDataAsync(dbContext, cancellationToken);
        }

        if (!await dbContext.Courts.AnyAsync(cancellationToken))
        {
            await SeedCourtOperationsAsync(dbContext, cancellationToken);
        }

        await LinkClassesToCourtsAsync(dbContext, cancellationToken);

        if (!await dbContext.FinanceEntries.AnyAsync(cancellationToken))
        {
            await SeedFinanceOperationsAsync(dbContext, cancellationToken);
        }

        await EnsurePeopleOperationsDataAsync(dbContext, cancellationToken);
        await EnsureCoachOperationsDataAsync(dbContext, cancellationToken);
        await EnsureOwnerManagementDataAsync(dbContext, cancellationToken);
        await EnsureExtendedOperationsDataAsync(dbContext, cancellationToken);
        await EnsureMembershipCourtBenefitsAsync(dbContext, cancellationToken);
        await EnsureBookingLifecycleDataAsync(dbContext, cancellationToken);
        await EnsureFinancialSourceDataAsync(dbContext, cancellationToken);
    }

    private static async Task EnsureMembershipCourtBenefitsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var package = await dbContext.Packages
            .Where(item => item.SessionCount == 12)
            .OrderBy(item => item.Price)
            .FirstOrDefaultAsync(cancellationToken);
        if (package is null)
        {
            return;
        }

        if (!package.IncludesFreeCourt)
        {
            package.Update(
                package.Name,
                package.SessionCount,
                package.Price,
                30,
                2,
                120);
        }

        var renewals = await dbContext.PaymentRenewals
            .Where(item => item.PackageId == package.Id)
            .ToListAsync(cancellationToken);
        foreach (var renewal in renewals.Where(item => item.FreeCourtUsesGranted == 0))
        {
            renewal.ConfigureCourtBenefit(
                renewal.CreatedAtUtc,
                renewal.CreatedAtUtc.AddDays(package.ValidityDays),
                package.FreeCourtUses);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedCorePrototypeDataAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var adminUser = new User(
            "admin",
            "Chủ sân VNS PickleTrack",
            HashPin("123456"),
            UserRole.Admin);
        var coachUser = new User(
            "coach",
            "Coach Minh",
            HashPin("111111"),
            UserRole.Coach);
        var memberLoginUser = new User(
            "member",
            "Nguyễn Văn An",
            HashPin("222222"),
            UserRole.Member);

        var coach = new Coach(coachUser.Id, "Coach Minh");
        var basicClass = new TrainingClass("Lớp Cơ bản A1", coach.Id, "Sân 1");
        var intermediateClass = new TrainingClass("Lớp Trung cấp B1", coach.Id, "Sân 2");
        var advancedClass = new TrainingClass("Lớp Nâng cao C1", coach.Id, "Sân 3");

        var users = new[]
        {
            adminUser,
            coachUser,
            memberLoginUser,
            new User("tranthib", "Trần Thị Bình", HashPin("222222"), UserRole.Member),
            new User("levanc", "Lê Văn Cường", HashPin("222222"), UserRole.Member),
            new User("phamthid", "Phạm Thị Dung", HashPin("222222"), UserRole.Member),
            new User("hoangvane", "Hoàng Văn Em", HashPin("222222"), UserRole.Member),
            new User("vothif", "Võ Thị Phương", HashPin("222222"), UserRole.Member),
            new User("dangvang", "Đặng Văn Giang", HashPin("222222"), UserRole.Member),
            new User("ngothih", "Ngô Thị Hạnh", HashPin("222222"), UserRole.Member)
        };

        var members = new[]
        {
            new Member(users[2].Id, users[2].DisplayName, "0908888888", "Cơ bản"),
            new Member(users[3].Id, users[3].DisplayName, "0901234568", "Cơ bản"),
            new Member(users[4].Id, users[4].DisplayName, "0901234569", "Trung cấp"),
            new Member(users[5].Id, users[5].DisplayName, "0901234570", "Cơ bản"),
            new Member(users[6].Id, users[6].DisplayName, "0901234571", "Cơ bản"),
            new Member(users[7].Id, users[7].DisplayName, "0901234572", "Trung cấp"),
            new Member(users[8].Id, users[8].DisplayName, "0901234573", "Nâng cao"),
            new Member(users[9].Id, users[9].DisplayName, "0901234574", "Nâng cao")
        };

        var packages = new[]
        {
            new Package("Gói 8 buổi", 8, 1_600_000m),
            new Package("Gói 12 buổi", 12, 2_400_000m, 30, 2, 120),
            new Package("Gói 24 buổi", 24, 4_500_000m)
        };

        var paymentSessionCounts = new[] { 12, 12, 8, 24, 12, 12, 12, 12 };
        var packageByMember = new[]
        {
            packages[1], packages[1], packages[0], packages[2],
            packages[1], packages[1], packages[1], packages[1]
        };
        var payments = members
            .Select((member, index) => new PaymentRenewal(
                member.Id,
                packageByMember[index].Id,
                paymentSessionCounts[index],
                packageByMember[index].Price,
                expiresAtUtc: DateTimeOffset.UtcNow.AddDays(packageByMember[index].ValidityDays),
                freeCourtUsesGranted: packageByMember[index].FreeCourtUses))
            .ToArray();

        var classes = new[] { basicClass, intermediateClass, advancedClass };
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localToday = DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone).Date);
        var sessions = new List<ClassSession>();

        for (var daysAgo = 12; daysAgo >= 1; daysAgo--)
        {
            var sessionDate = localToday.AddDays(-daysAgo);
            sessions.Add(CreateSession(basicClass.Id, sessionDate, 7, timeZone));
            sessions.Add(CreateSession(intermediateClass.Id, sessionDate, 9, timeZone));
            sessions.Add(CreateSession(advancedClass.Id, sessionDate, 17, timeZone));
        }

        sessions.Add(CreateSession(basicClass.Id, localToday, 7, timeZone));
        sessions.Add(CreateSession(intermediateClass.Id, localToday, 9, timeZone));
        sessions.Add(CreateSession(advancedClass.Id, localToday, 17, timeZone));

        var deductingCounts = new[] { 5, 10, 8, 8, 9, 0, 12, 11 };
        var memberClassIndexes = new[] { 0, 0, 1, 0, 0, 1, 2, 2 };
        var statuses = new[]
        {
            AttendanceStatus.Present,
            AttendanceStatus.Late,
            AttendanceStatus.Makeup,
            AttendanceStatus.Present,
            AttendanceStatus.Leave
        };
        var attendance = new List<AttendanceRecord>();

        for (var memberIndex = 0; memberIndex < members.Length; memberIndex++)
        {
            var classSessions = sessions
                .Where(session =>
                    session.ClassId == classes[memberClassIndexes[memberIndex]].Id &&
                    session.StartsAtUtc < DateTimeOffset.UtcNow)
                .Take(deductingCounts[memberIndex])
                .ToArray();

            for (var attendanceIndex = 0;
                 attendanceIndex < classSessions.Length;
                 attendanceIndex++)
            {
                attendance.Add(new AttendanceRecord(
                    classSessions[attendanceIndex].Id,
                    members[memberIndex].Id,
                    statuses[attendanceIndex % 3]));
            }
        }

        // Include both non-deducting MVP statuses in realistic history.
        attendance.Add(new AttendanceRecord(
            sessions.First(x => x.ClassId == basicClass.Id).Id,
            members[7].Id,
            AttendanceStatus.Absent));
        attendance.Add(new AttendanceRecord(
            sessions.First(x => x.ClassId == intermediateClass.Id).Id,
            members[5].Id,
            AttendanceStatus.Leave));

        await dbContext.AddRangeAsync(users, cancellationToken);
        await dbContext.AddAsync(coach, cancellationToken);
        await dbContext.AddRangeAsync(classes, cancellationToken);
        await dbContext.AddRangeAsync(members, cancellationToken);
        await dbContext.AddRangeAsync(packages, cancellationToken);
        await dbContext.AddRangeAsync(payments, cancellationToken);
        await dbContext.AddRangeAsync(sessions, cancellationToken);
        await dbContext.AddRangeAsync(attendance, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedCourtOperationsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var courts = new[]
        {
            new Court("Sân 1", "Acrylic ngoài trời", 180_000m),
            new Court("Sân 2", "Acrylic ngoài trời", 180_000m),
            new Court("Sân 3", "Acrylic có mái che", 220_000m),
            new Court("Sân 4", "Acrylic có mái che", 220_000m)
        };
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localToday = DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone).Date);
        var bookingSeeds = new[]
        {
            (0, "Anh Minh", "0908123456", 6, 90, "confirmed"),
            (1, "Chị Lan", "0912233445", 8, 120, "checkedIn"),
            (2, "CLB Sunrise", "0988777666", 15, 120, "confirmed"),
            (3, "Nhóm Pickle 5AM", "0934555666", 18, 90, "pending")
        };
        var bookings = bookingSeeds.Select(seed =>
        {
            var localStart = localToday.ToDateTime(
                new TimeOnly(seed.Item4, 0),
                DateTimeKind.Unspecified);
            var startsAtUtc = new DateTimeOffset(
                TimeZoneInfo.ConvertTimeToUtc(localStart, timeZone));
            var endsAtUtc = startsAtUtc.AddMinutes(seed.Item5);
            var hours = seed.Item5 / 60m;
            return new CourtBooking(
                courts[seed.Item1].Id,
                seed.Item2,
                seed.Item3,
                startsAtUtc,
                endsAtUtc,
                courts[seed.Item1].HourlyRate * hours,
                seed.Item6);
        }).ToArray();

        await dbContext.AddRangeAsync(courts, cancellationToken);
        await dbContext.AddRangeAsync(bookings, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedFinanceOperationsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localToday = DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone).Date);

        DateTimeOffset AtLocal(int daysFromToday, int hour)
        {
            var local = localToday.AddDays(daysFromToday)
                .ToDateTime(new TimeOnly(hour, 0), DateTimeKind.Unspecified);
            return new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(local, timeZone));
        }

        var entries = new[]
        {
            new FinanceEntry("PT-260501", "income", "courtRental", "Nguyễn Lan", 450_000m, "transfer",
                AtLocal(0, 8), "BK-260501", "Thuê sân A1", "reconciled", 450_000m),
            new FinanceEntry("PC-260502", "expense", "maintenance", "Nhà thầu Minh Tâm", 1_200_000m, "transfer",
                AtLocal(0, 10), null, "Bảo trì sân B2", "pending"),
            new FinanceEntry("PT-260503", "income", "membership", "Chị Hạnh", 2_500_000m, "transfer",
                AtLocal(0, 14), "GH-260503", "Gia hạn Premium", "mismatch", 2_300_000m),
            new FinanceEntry("PT-260498", "income", "retail", "Khách vãng lai", 900_000m, "cash",
                AtLocal(-2, 17), null, "Bù đắp private", "reconciled", 900_000m),
            new FinanceEntry("PC-260497", "expense", "utilities", "Điện lực", 3_400_000m, "transfer",
                AtLocal(-4, 9), null, "Tiền điện tháng", "reconciled", 3_400_000m)
        };
        var debts = new[]
        {
            new FinanceDebt("receivable", "Lê Thanh Vy", "Học phí gói Premium còn thiếu", 1_250_000m, 0m, AtLocal(-2, 23), counterpartyType: "member"),
            new FinanceDebt("receivable", "CLB Sunrise", "Thuê sân định kỳ tháng 06", 5_550_000m, 0m, AtLocal(5, 23), counterpartyType: "booking"),
            new FinanceDebt("payable", "Điện lực khu vực", "Tiền điện tháng 05", 5_200_000m, 0m, AtLocal(2, 23), counterpartyType: "supplier"),
            new FinanceDebt("payable", "Nhà cung cấp An Phát", "Nhập nước uống", 3_800_000m, 0m, AtLocal(8, 23), counterpartyType: "supplier"),
            new FinanceDebt("payable", "Bảo trì sân B2", "Chi phí sửa chữa", 3_000_000m, 0m, AtLocal(-1, 23), counterpartyType: "other")
        };

        await dbContext.AddRangeAsync(entries, cancellationToken);
        await dbContext.AddRangeAsync(debts, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsurePeopleOperationsDataAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var existingUsernames = await dbContext.Users
            .AsNoTracking()
            .Select(item => item.Username)
            .ToListAsync(cancellationToken);
        var newCoachSeeds = new[]
        {
            (Username: "coachthao", Name: "HLV Thảo", ClassName: "Lớp Hội viên cuối tuần", Court: "Sân 2", Hour: 16),
            (Username: "coachduc", Name: "HLV Đức", ClassName: "Lớp Kỹ thuật nâng cao", Court: "Sân 3", Hour: 19)
        }.Where(seed => !existingUsernames.Contains(seed.Username, StringComparer.OrdinalIgnoreCase)).ToArray();

        if (newCoachSeeds.Length == 0)
        {
            return;
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localToday = DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone).Date);

        foreach (var seed in newCoachSeeds)
        {
            var user = new User(seed.Username, seed.Name, HashPin("111111"), UserRole.Coach);
            var coach = new Coach(user.Id, seed.Name);
            var trainingClass = new TrainingClass(seed.ClassName, coach.Id, seed.Court);
            var sessions = Enumerable.Range(0, 4)
                .Select(offset => CreateSession(
                    trainingClass.Id,
                    localToday.AddDays(offset * 2),
                    seed.Hour,
                    timeZone))
                .ToArray();

            await dbContext.AddAsync(user, cancellationToken);
            await dbContext.AddAsync(coach, cancellationToken);
            await dbContext.AddAsync(trainingClass, cancellationToken);
            await dbContext.AddRangeAsync(sessions, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task LinkClassesToCourtsAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var courts = await dbContext.Courts
            .ToDictionaryAsync(item => item.Name, StringComparer.OrdinalIgnoreCase, cancellationToken);
        var classes = await dbContext.Classes
            .Where(item => item.CourtId == null && item.CourtName != null)
            .ToListAsync(cancellationToken);

        foreach (var trainingClass in classes)
        {
            if (trainingClass.CourtName is not null &&
                courts.TryGetValue(trainingClass.CourtName, out var court))
            {
                trainingClass.AssignCourt(court.Id, court.Name);
            }
        }

        if (classes.Count > 0)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    private static async Task EnsureExtendedOperationsDataAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var localToday = DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone).Date);

        DateTimeOffset AtLocal(int dayOffset, int hour)
        {
            var local = localToday.AddDays(dayOffset)
                .ToDateTime(new TimeOnly(hour, 0), DateTimeKind.Unspecified);
            return new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(local, timeZone));
        }

        var todayStart = AtLocal(0, 0);
        var tomorrowStart = AtLocal(1, 0);
        if (!await dbContext.StaffShifts.AnyAsync(
            item => item.StartsAtUtc >= todayStart && item.StartsAtUtc < tomorrowStart,
            cancellationToken))
        {
            await dbContext.StaffShifts.AddRangeAsync(new[]
            {
                new StaffShift("Ngô Bảo", AtLocal(0, 6), AtLocal(0, 14), "handedOver"),
                new StaffShift("Lê Hùng", AtLocal(0, 14), AtLocal(0, 22), "scheduled"),
                new StaffShift("Mai Phương", AtLocal(0, 18), AtLocal(0, 22), "scheduled"),
                new StaffShift("Trần An", AtLocal(0, 8), AtLocal(0, 16), "absent")
            }, cancellationToken);
        }

        if (!await dbContext.InventoryItems.AnyAsync(cancellationToken))
        {
            await dbContext.InventoryItems.AddRangeAsync(new[]
            {
                new InventoryItem("DRINK-500", "Nước suối 500ml", "retail", 15_000m, 8_000m, 12, 20),
                new InventoryItem("BALL-001", "Bóng Pickleball", "retail", 45_000m, 28_000m, 48, 10),
                new InventoryItem("TOWEL-001", "Khăn lạnh", "retail", 10_000m, 4_000m, 30, 8),
                new InventoryItem("RENT-RACKET", "Vợt cho thuê", "rental", 40_000m, 850_000m, 6, 1, 8, 2),
                new InventoryItem("GRIP-001", "Quấn cán vợt", "retail", 35_000m, 18_000m, 0, 5)
            }, cancellationToken);
        }

        if (!await dbContext.ContentItems.AnyAsync(cancellationToken))
        {
            var packages = await dbContext.Packages.AsNoTracking().OrderBy(item => item.Price).ToListAsync(cancellationToken);
            await dbContext.ContentItems.AddRangeAsync(new[]
            {
                new ContentItem("Nội quy sân", "rules", "approved", null, "Quy định sử dụng sân và bảo quản tài sản."),
                new ContentItem("Quy định đặt / hủy lịch", "bookingPolicy", "approved", null, "Điều kiện đổi, hủy và hoàn phí booking."),
                new ContentItem("Video nâng cao • HLV Minh", "video", "pending", packages.LastOrDefault()?.Id, "Video kỹ thuật dành cho hội viên nâng cao."),
                new ContentItem("Quyền lợi hội viên Plus", "benefit", "approved", packages.FirstOrDefault()?.Id, "Tổng hợp quyền lợi theo gói hội viên.")
            }, cancellationToken);
        }

        if (!await dbContext.Promotions.AnyAsync(cancellationToken))
        {
            await dbContext.Promotions.AddRangeAsync(new[]
            {
                new Promotion("Giảm 15% khung giờ thấp điểm", "all", "discount", 15m, AtLocal(-5, 6), AtLocal(20, 16), "Áp dụng 06:00 - 16:00"),
                new Promotion("Tặng 2 giờ • Premium", "premium", "bonusHours", 2m, AtLocal(-2, 0), AtLocal(18, 23), "Áp dụng khi gia hạn Premium"),
                new Promotion("Ưu đãi hội viên mới", "newMembers", "discount", 10m, AtLocal(5, 0), AtLocal(30, 23), "Giảm cho lần đặt đầu tiên")
            }, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureCoachOperationsDataAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var coaches = await dbContext.Coaches.OrderBy(item => item.FullName).ToListAsync(cancellationToken);
        var agreements = new[]
        {
            (Type: "hourlyRental", Rate: 150_000m, Share: 0m),
            (Type: "revenueShare", Rate: 0m, Share: 25m),
            (Type: "hybrid", Rate: 100_000m, Share: 10m)
        };

        for (var index = 0; index < coaches.Count; index++)
        {
            var agreement = agreements[index % agreements.Length];
            coaches[index].UpdateAgreement("active", agreement.Type, agreement.Rate, agreement.Share);
        }

        if (!await dbContext.CoachSettlements.AnyAsync(cancellationToken))
        {
            var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
            var localNow = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone);
            var period = $"{localNow:yyyy-MM}";
            var classes = await dbContext.Classes.AsNoTracking().ToListAsync(cancellationToken);
            var sessions = await dbContext.Sessions.AsNoTracking()
                .Where(item => !item.IsCancelled)
                .ToListAsync(cancellationToken);

            foreach (var coach in coaches)
            {
                var classIds = classes
                    .Where(item => item.CoachId == coach.Id)
                    .Select(item => item.Id)
                    .ToHashSet();
                var coachSessions = sessions.Where(item => classIds.Contains(item.ClassId)).ToArray();
                var usageHours = coachSessions.Sum(item => (decimal)(item.EndsAtUtc - item.StartsAtUtc).TotalHours);
                var grossRevenue = coach.AgreementType == "revenueShare" || coach.AgreementType == "hybrid"
                    ? usageHours * 800_000m
                    : 0m;
                var courtFee = coach.AgreementType switch
                {
                    "revenueShare" => grossRevenue * coach.RevenueSharePercent / 100m,
                    "hybrid" => usageHours * coach.HourlyCourtRate +
                        grossRevenue * coach.RevenueSharePercent / 100m,
                    _ => usageHours * coach.HourlyCourtRate
                };
                var paidAmount = courtFee > 0 ? Math.Round(courtFee * 0.6m, 0) : 0m;
                await dbContext.CoachSettlements.AddAsync(
                    new CoachSettlement(
                        coach.Id,
                        period,
                        usageHours,
                        grossRevenue,
                        courtFee,
                        paidAmount,
                        paidAmount >= courtFee ? "reconciled" : paidAmount > 0 ? "partial" : "pending"),
                    cancellationToken);
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureOwnerManagementDataAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var coaches = await dbContext.Coaches.OrderBy(item => item.FullName).ToListAsync(cancellationToken);
        for (var index = 0; index < coaches.Count; index++)
        {
            coaches[index].UpdateProfile(
                null,
                $"09090000{index + 1:00}",
                $"coach{index + 1}@vns.local",
                index == 0 ? "HLV chuyên nghiệp" : "HLV cộng tác",
                "Chứng chỉ huấn luyện Pickleball",
                3 + index,
                "Kỹ thuật nền tảng, chiến thuật thi đấu",
                "Đối tác huấn luyện độc lập tại VNS PickleTrack.",
                "Thứ 2 - Chủ nhật, theo lịch thuê sân");
        }

        if (!await dbContext.CourtPriceRules.AnyAsync(cancellationToken))
        {
            var courts = await dbContext.Courts.AsNoTracking().OrderBy(item => item.Name).ToListAsync(cancellationToken);
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            foreach (var court in courts)
            {
                await dbContext.CourtPriceRules.AddRangeAsync(new[]
                {
                    new CourtPriceRule(court.Id, "guest", "weekday", "regular", new TimeOnly(5, 0), new TimeOnly(17, 0), court.HourlyRate, today, string.Empty, "System seed"),
                    new CourtPriceRule(court.Id, "guest", "weekday", "peak", new TimeOnly(17, 0), new TimeOnly(23, 0), court.HourlyRate * 1.25m, today, string.Empty, "System seed"),
                    new CourtPriceRule(court.Id, "member", "all", "regular", new TimeOnly(5, 0), new TimeOnly(23, 0), court.HourlyRate * 0.9m, today, string.Empty, "System seed"),
                    new CourtPriceRule(court.Id, "coach", "all", "regular", new TimeOnly(5, 0), new TimeOnly(23, 0), court.HourlyRate * 0.8m, today, string.Empty, "System seed")
                }, cancellationToken);
            }
        }

        var migratedPeakRules = await dbContext.CourtPriceRules
            .Where(rule =>
                rule.PriceType == "regular" &&
                rule.CustomerType == "guest" &&
                rule.DayType == "weekday" &&
                rule.StartTime == new TimeOnly(17, 0) &&
                rule.EndTime == new TimeOnly(23, 0))
            .ToListAsync(cancellationToken);
        foreach (var rule in migratedPeakRules)
        {
            rule.Update(
                rule.CourtId,
                rule.CustomerType,
                rule.DayType,
                "peak",
                rule.StartTime,
                rule.EndTime,
                rule.HourlyRate,
                rule.EffectiveFrom,
                rule.HolidayDates);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureFinancialSourceDataAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var renewals = await (
            from renewal in dbContext.PaymentRenewals
            join member in dbContext.Members on renewal.MemberId equals member.Id
            where renewal.PaymentStatus == "paid"
            select new { Renewal = renewal, member.FullName })
            .ToListAsync(cancellationToken);
        var references = await dbContext.FinanceEntries.AsNoTracking()
            .Where(item => item.ReferenceCode != null && item.ReferenceCode.StartsWith("RENEWAL:"))
            .Select(item => item.ReferenceCode!)
            .ToHashSetAsync(cancellationToken);

        foreach (var item in renewals)
        {
            var reference = $"RENEWAL:{item.Renewal.Id:N}";
            if (references.Contains(reference)) continue;
            await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
                $"PT-SEED-{item.Renewal.Id.ToString("N")[..8].ToUpperInvariant()}",
                "income",
                "membership",
                item.FullName,
                item.Renewal.Amount,
                item.Renewal.PaymentMethod,
                item.Renewal.CreatedAtUtc,
                reference,
                item.Renewal.Note ?? "Thanh toán gia hạn",
                "reconciled",
                item.Renewal.Amount,
                createdBy: "Demo seed"), cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureBookingLifecycleDataAsync(
        PickleTrackDbContext dbContext,
        CancellationToken cancellationToken)
    {
        const string seedPrefix = "BOOKING-DEMO-7D:";
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        var today = DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, timeZone).Date);
        var courts = await dbContext.Courts.OrderBy(item => item.Name).ToListAsync(cancellationToken);
        if (courts.Count == 0)
        {
            return;
        }

        DateTimeOffset ToUtc(DateOnly date, int hour, int minute = 0)
        {
            var local = date.ToDateTime(new TimeOnly(hour, minute), DateTimeKind.Unspecified);
            return new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(local, timeZone));
        }

        var statuses = new[]
        {
            "pending", "confirmed", "playing", "completed", "cancelled",
            "confirmed", "pending", "completed", "confirmed", "playing",
            "cancelled", "confirmed", "completed", "pending"
        };
        var customers = new[]
        {
            ("Khách Minh Quân", "guest"),
            ("Hội viên Nguyễn Lan", "member"),
            ("Học viên Trần An", "student"),
            ("Khách CLB Sunrise", "guest")
        };
        var createdBookings = new List<CourtBooking>();

        for (var index = 0; index < 14; index++)
        {
            var dayOffset = index / 2 + 1;
            var date = today.AddDays(dayOffset);
            var court = courts[index % courts.Count];
            var startsAtUtc = index % 2 == 0 ? ToUtc(date, 11) : ToUtc(date, 20, 30);
            var endsAtUtc = startsAtUtc.AddMinutes(index % 3 == 0 ? 90 : 60);
            var customer = customers[index % customers.Length];
            var phone = $"090700{dayOffset:00}{index:00}";
            var exists = await dbContext.CourtBookings.AnyAsync(item =>
                item.CustomerPhone == phone &&
                item.StartsAtUtc == startsAtUtc,
                cancellationToken);
            if (exists)
            {
                continue;
            }

            var hasOverlap = await dbContext.CourtBookings.AnyAsync(item =>
                item.CourtId == court.Id &&
                item.Status != "cancelled" &&
                item.StartsAtUtc < endsAtUtc &&
                item.EndsAtUtc > startsAtUtc,
                cancellationToken);
            if (hasOverlap)
            {
                continue;
            }

            var amount = court.HourlyRate * (decimal)(endsAtUtc - startsAtUtc).TotalHours;
            createdBookings.Add(new CourtBooking(
                court.Id,
                customer.Item1,
                phone,
                startsAtUtc,
                endsAtUtc,
                amount,
                statuses[index],
                customer.Item2));
        }

        if (createdBookings.Count > 0)
        {
            await dbContext.CourtBookings.AddRangeAsync(createdBookings, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        var seededBookings = await dbContext.CourtBookings
            .Where(item => item.CustomerPhone.StartsWith("090700"))
            .OrderBy(item => item.StartsAtUtc)
            .ToListAsync(cancellationToken);
        var inventory = await dbContext.InventoryItems.ToDictionaryAsync(
            item => item.Sku,
            StringComparer.OrdinalIgnoreCase,
            cancellationToken);

        for (var index = 0; index < seededBookings.Count; index++)
        {
            var booking = seededBookings[index];
            var reference = $"{seedPrefix}{booking.Id:N}";
            var total = booking.Amount;

            if (index % 3 == 0 &&
                !await dbContext.BookingCharges.AnyAsync(
                    item => item.BookingId == booking.Id && item.Description == "Phụ thu ngoài giờ",
                    cancellationToken))
            {
                await dbContext.BookingCharges.AddAsync(
                    new BookingCharge(booking.Id, "surcharge", "Phụ thu ngoài giờ", 1, 50_000m),
                    cancellationToken);
                total += 50_000m;
            }
            if (index % 4 == 0 &&
                !await dbContext.BookingCharges.AnyAsync(
                    item => item.BookingId == booking.Id && item.Description == "Ưu đãi hội viên",
                    cancellationToken))
            {
                await dbContext.BookingCharges.AddAsync(
                    new BookingCharge(booking.Id, "discount", "Ưu đãi hội viên", 1, 30_000m),
                    cancellationToken);
                total -= 30_000m;
            }
            if (index % 5 == 0 &&
                !await dbContext.BookingCharges.AnyAsync(
                    item => item.BookingId == booking.Id && item.Description == "Thuê vợt",
                    cancellationToken))
            {
                await dbContext.BookingCharges.AddAsync(
                    new BookingCharge(booking.Id, "rental", "Thuê vợt", 1, 40_000m),
                    cancellationToken);
                total += 40_000m;
            }

            var stockSkus = new[] { "DRINK-500", "BALL-001", "RENT-RACKET", "TOWEL-001" };
            if (index < stockSkus.Length &&
                inventory.TryGetValue(stockSkus[index], out var stockItem))
            {
                var idempotencyKey = $"{reference}:POS";
                if (!await dbContext.PosSales.AnyAsync(
                    item => item.IdempotencyKey == idempotencyKey,
                    cancellationToken))
                {
                    var quantity = index % 2 == 0 ? 2 : 1;
                    var removed = stockItem.Category == "rental"
                        ? stockItem.TryCheckoutRental(quantity)
                        : stockItem.TryRemoveStock(quantity);
                    if (removed)
                    {
                        var lineTotal = stockItem.SalePrice * quantity;
                        var saleCode = $"POS-SEED-{booking.BookingCode[3..]}";
                        var saleLines = new[]
                        {
                            new
                            {
                                ItemId = stockItem.Id,
                                stockItem.Name,
                                Quantity = quantity,
                                UnitPrice = stockItem.SalePrice,
                                LineTotal = lineTotal,
                                UnitCost = stockItem.CostPrice
                            }
                        };
                        await dbContext.PosSales.AddAsync(new PosSale(
                            saleCode,
                            booking.Id,
                            lineTotal,
                            stockItem.CostPrice * quantity,
                            System.Text.Json.JsonSerializer.Serialize(saleLines),
                            "invoice",
                            "invoiced",
                            idempotencyKey), cancellationToken);
                        await dbContext.InventoryMovements.AddAsync(new InventoryMovement(
                            stockItem.Id,
                            stockItem.Category == "rental" ? "rentalCheckout" : "sale",
                            -quantity,
                            stockItem.CostPrice,
                            booking.BookingCode,
                            "Demo seed"), cancellationToken);
                        total += lineTotal;
                    }
                }
            }

            var invoiceAmount = Math.Max(0, total);
            FinanceDebt? debt = null;
            if (invoiceAmount > 0)
            {
                debt = await dbContext.FinanceDebts.SingleOrDefaultAsync(
                    item => item.SourceType == "courtBooking" && item.SourceId == booking.Id,
                    cancellationToken);
                if (debt is null)
                {
                    debt = new FinanceDebt(
                        "receivable",
                        booking.CustomerName,
                        $"Hóa đơn booking {booking.BookingCode}",
                        invoiceAmount,
                        0,
                        booking.EndsAtUtc.AddDays(7),
                        "courtBooking",
                        booking.Id,
                        booking.CustomerType is "member" or "student" ? "member" : "booking");
                    await dbContext.FinanceDebts.AddAsync(debt, cancellationToken);
                }
                else if (!debt.IsCancelled && invoiceAmount >= debt.PaidAmount && debt.Amount != invoiceAmount)
                {
                    debt.SyncAmount(invoiceAmount);
                }
            }

            if (booking.Status != "cancelled" && index % 3 != 0 && invoiceAmount > 0 && debt is not null &&
                !await dbContext.BookingPayments.AnyAsync(
                    item => item.BookingId == booking.Id && item.TransactionType == "payment",
                    cancellationToken))
            {
                var paymentAmount = index % 4 == 1
                    ? Math.Round(invoiceAmount / 2m, 0)
                    : invoiceAmount;
                var payableAmount = Math.Min(
                    Math.Max(0, invoiceAmount - booking.PaidAmount),
                    debt.OutstandingAmount);
                paymentAmount = Math.Min(paymentAmount, payableAmount);
                if (paymentAmount <= 0)
                {
                    continue;
                }

                var receiptCode = $"PT-SEED-{booking.BookingCode[3..]}";
                booking.RecordPayment(paymentAmount, "transfer", receiptCode);
                debt.RecordPayment(paymentAmount);
                await dbContext.BookingPayments.AddAsync(new BookingPayment(
                    booking.Id,
                    receiptCode,
                    paymentAmount,
                    "transfer",
                    booking.StartsAtUtc.AddHours(-2),
                    "Demo seed"), cancellationToken);
                await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
                    receiptCode,
                    "income",
                    "courtRental",
                    booking.CustomerName,
                    paymentAmount,
                    "transfer",
                    booking.StartsAtUtc.AddHours(-2),
                    $"BOOKING:{booking.Id:N}",
                    $"Thanh toán {booking.BookingCode}",
                    "reconciled",
                    paymentAmount,
                    createdBy: "Demo seed"), cancellationToken);

                if (index == 2 && booking.PaidAmount >= 30_000m)
                {
                    var refundAmount = 30_000m;
                    var refundCode = $"HT-SEED-{booking.BookingCode[3..]}";
                    booking.RecordRefund(refundAmount);
                    debt.RecordRefund(refundAmount);
                    await dbContext.BookingPayments.AddAsync(new BookingPayment(
                        booking.Id,
                        refundCode,
                        refundAmount,
                        "transfer",
                        booking.StartsAtUtc.AddHours(-1),
                        "Demo seed",
                        "refund",
                        "Hoàn một phần do điều chỉnh dịch vụ"), cancellationToken);
                    await dbContext.FinanceEntries.AddAsync(new FinanceEntry(
                        refundCode,
                        "refund",
                        "refund",
                        booking.CustomerName,
                        refundAmount,
                        "transfer",
                        booking.StartsAtUtc.AddHours(-1),
                        $"BOOKING:{booking.Id:N}",
                        $"Hoàn tiền {booking.BookingCode}",
                        "reconciled",
                        refundAmount,
                        createdBy: "Demo seed"), cancellationToken);
                }
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        if (seededBookings.Count >= 3 &&
            inventory.TryGetValue("RENT-RACKET", out var rentalItem))
        {
            var rentalBooking = seededBookings[2];
            var rentalKey = $"{seedPrefix}{rentalBooking.Id:N}:RENTAL";
            var existingRentalSales = await dbContext.PosSales.AsNoTracking()
                .Where(item => item.BookingId == rentalBooking.Id)
                .Select(item => item.ItemsJson)
                .ToListAsync(cancellationToken);
            var rentalAlreadyLinked = existingRentalSales.Any(itemsJson =>
                itemsJson.Contains(rentalItem.Id.ToString(), StringComparison.OrdinalIgnoreCase));
            if (!rentalAlreadyLinked &&
                !await dbContext.PosSales.AnyAsync(
                item => item.IdempotencyKey == rentalKey,
                cancellationToken) &&
                rentalItem.TryCheckoutRental(1))
            {
                var lineTotal = rentalItem.SalePrice;
                var saleCode = $"POS-RENT-{rentalBooking.BookingCode[3..]}";
                var rentalLines = new[]
                {
                    new
                    {
                        ItemId = rentalItem.Id,
                        rentalItem.Name,
                        Quantity = 1,
                        UnitPrice = rentalItem.SalePrice,
                        LineTotal = lineTotal,
                        UnitCost = rentalItem.CostPrice
                    }
                };
                await dbContext.PosSales.AddAsync(new PosSale(
                    saleCode,
                    rentalBooking.Id,
                    lineTotal,
                    rentalItem.CostPrice,
                    System.Text.Json.JsonSerializer.Serialize(rentalLines),
                    "invoice",
                    "invoiced",
                    rentalKey), cancellationToken);
                await dbContext.InventoryMovements.AddAsync(new InventoryMovement(
                    rentalItem.Id,
                    "rentalCheckout",
                    -1,
                    rentalItem.CostPrice,
                    $"{rentalBooking.BookingCode}:{saleCode}",
                    "Demo seed"), cancellationToken);
                var rentalDebt = await dbContext.FinanceDebts.SingleAsync(
                    item => item.SourceType == "courtBooking" && item.SourceId == rentalBooking.Id,
                    cancellationToken);
                rentalDebt.SyncAmount(rentalDebt.Amount + lineTotal);
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public static string HashPin(string pin)
    {
        return Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(pin)));
    }

    private static ClassSession CreateSession(
        Guid classId,
        DateOnly date,
        int startHour,
        TimeZoneInfo timeZone)
    {
        var localStart = date.ToDateTime(
            new TimeOnly(startHour, 0),
            DateTimeKind.Unspecified);
        var startsAtUtc = TimeZoneInfo.ConvertTimeToUtc(localStart, timeZone);
        return new ClassSession(
            classId,
            new DateTimeOffset(startsAtUtc),
            new DateTimeOffset(startsAtUtc.AddMinutes(90)));
    }
}
