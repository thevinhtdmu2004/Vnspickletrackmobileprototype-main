using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class GeneralDebtAndBookingInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CounterpartyType",
                schema: "pickletrack",
                table: "finance_debts",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "other");

            migrationBuilder.Sql("""
                UPDATE pickletrack.finance_debts
                SET "CounterpartyType" = CASE
                    WHEN "SourceType" = 'coachSettlement' THEN 'coach'
                    WHEN "SourceType" = 'memberRenewal' THEN 'member'
                    WHEN "SourceType" = 'courtBooking' THEN 'booking'
                    WHEN "Counterparty" ILIKE '%nhà cung cấp%'
                      OR "Counterparty" ILIKE '%điện lực%' THEN 'supplier'
                    ELSE 'other'
                END;
                """);

            migrationBuilder.AddColumn<decimal>(
                name: "PaidAmount",
                schema: "pickletrack",
                table: "court_bookings",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                schema: "pickletrack",
                table: "court_bookings",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiptCode",
                schema: "pickletrack",
                table: "court_bookings",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "booking_charges",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChargeType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Description = table.Column<string>(type: "character varying(240)", maxLength: 240, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    UnitAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_charges", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_booking_charges_BookingId_ChargeType",
                schema: "pickletrack",
                table: "booking_charges",
                columns: new[] { "BookingId", "ChargeType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "booking_charges",
                schema: "pickletrack");

            migrationBuilder.DropColumn(
                name: "CounterpartyType",
                schema: "pickletrack",
                table: "finance_debts");

            migrationBuilder.DropColumn(
                name: "PaidAmount",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "ReceiptCode",
                schema: "pickletrack",
                table: "court_bookings");
        }
    }
}
