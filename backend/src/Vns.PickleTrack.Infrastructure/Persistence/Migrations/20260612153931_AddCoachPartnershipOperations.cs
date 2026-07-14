using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCoachPartnershipOperations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AgreementType",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "hourlyRental");

            migrationBuilder.AddColumn<decimal>(
                name: "HourlyCourtRate",
                schema: "pickletrack",
                table: "coaches",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 150000m);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "PartnershipStartedAtUtc",
                schema: "pickletrack",
                table: "coaches",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<string>(
                name: "PartnershipStatus",
                schema: "pickletrack",
                table: "coaches",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "active");

            migrationBuilder.AddColumn<decimal>(
                name: "RevenueSharePercent",
                schema: "pickletrack",
                table: "coaches",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "coach_settlements",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CoachId = table.Column<Guid>(type: "uuid", nullable: false),
                    Period = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    UsageHours = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    GrossRevenue = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CourtFee = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    PaidAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ReconciliationStatus = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ReconciledAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_coach_settlements", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_coach_settlements_CoachId_Period",
                schema: "pickletrack",
                table: "coach_settlements",
                columns: new[] { "CoachId", "Period" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "coach_settlements",
                schema: "pickletrack");

            migrationBuilder.DropColumn(
                name: "AgreementType",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "HourlyCourtRate",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "PartnershipStartedAtUtc",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "PartnershipStatus",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropColumn(
                name: "RevenueSharePercent",
                schema: "pickletrack",
                table: "coaches");
        }
    }
}
