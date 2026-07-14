using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerOperationsBalance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                schema: "pickletrack",
                table: "payment_renewals",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                schema: "pickletrack",
                table: "payment_renewals",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                schema: "pickletrack",
                table: "payment_renewals",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Biography",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Certificates",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExperienceYears",
                schema: "pickletrack",
                table: "coaches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfessionalLevel",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeachingSkills",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkingSchedule",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "booking_conflict_resolutions",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    ResolvedBy = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    ResolvedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_conflict_resolutions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "court_price_rules",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourtId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    DayType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    HourlyRate = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_court_price_rules", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_booking_conflict_resolutions_BookingId_ResolvedAtUtc",
                schema: "pickletrack",
                table: "booking_conflict_resolutions",
                columns: new[] { "BookingId", "ResolvedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_court_price_rules_CourtId_CustomerType_DayType_EffectiveFro~",
                schema: "pickletrack",
                table: "court_price_rules",
                columns: new[] { "CourtId", "CustomerType", "DayType", "EffectiveFrom", "StartTime" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "booking_conflict_resolutions",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "court_price_rules",
                schema: "pickletrack");

            migrationBuilder.DropColumn(
                name: "Note",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "Biography",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "Certificates",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "Email",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "ExperienceYears",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "ProfessionalLevel",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "TeachingSkills",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "WorkingSchedule",
                schema: "pickletrack",
                table: "coaches");
        }
    }
}
