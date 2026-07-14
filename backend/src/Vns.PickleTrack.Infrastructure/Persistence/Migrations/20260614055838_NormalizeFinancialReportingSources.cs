using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeFinancialReportingSources : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CostAmount",
                schema: "pickletrack",
                table: "pos_sales",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                schema: "pickletrack",
                table: "pos_sales",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                schema: "pickletrack",
                table: "pos_sales",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "booking_payments",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReceiptCode = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Method = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    PaidAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_booking_payments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "inventory_movements",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InventoryItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    MovementType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    QuantityChange = table.Column<int>(type: "integer", nullable: false),
                    UnitCost = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ReferenceCode = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inventory_movements", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_booking_payments_BookingId_PaidAtUtc",
                schema: "pickletrack",
                table: "booking_payments",
                columns: new[] { "BookingId", "PaidAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_booking_payments_ReceiptCode",
                schema: "pickletrack",
                table: "booking_payments",
                column: "ReceiptCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_inventory_movements_InventoryItemId_CreatedAtUtc",
                schema: "pickletrack",
                table: "inventory_movements",
                columns: new[] { "InventoryItemId", "CreatedAtUtc" });

            migrationBuilder.Sql(
                """
                UPDATE pickletrack.payment_renewals
                SET "PaymentMethod" = 'transfer'
                WHERE "PaymentMethod" = '';

                UPDATE pickletrack.payment_renewals
                SET "PaymentStatus" = 'paid'
                WHERE "PaymentStatus" = '';

                UPDATE pickletrack.pos_sales
                SET "PaymentMethod" = CASE WHEN "BookingId" IS NULL THEN 'cash' ELSE 'invoice' END,
                    "PaymentStatus" = CASE WHEN "BookingId" IS NULL THEN 'paid' ELSE 'invoiced' END;

                UPDATE pickletrack.pos_sales sale
                SET "CostAmount" = costs.total_cost
                FROM (
                    SELECT sale_row."Id",
                           COALESCE(SUM((line->>'Quantity')::integer * item."CostPrice"), 0) AS total_cost
                    FROM pickletrack.pos_sales sale_row
                    CROSS JOIN LATERAL jsonb_array_elements(sale_row."ItemsJson") line
                    JOIN pickletrack.inventory_items item
                      ON item."Id" = (line->>'ItemId')::uuid
                    GROUP BY sale_row."Id"
                ) costs
                WHERE costs."Id" = sale."Id";

                INSERT INTO pickletrack.finance_entries (
                    "Id", "Code", "Type", "Category", "Counterparty",
                    "Amount", "ActualAmount", "Method", "OccurredAtUtc",
                    "ReferenceCode", "Note", "ReconciliationStatus",
                    "CreatedAtUtc", "UpdatedAtUtc", "BranchName", "CreatedBy")
                SELECT renewal."Id",
                       'PT-LEG-' || UPPER(SUBSTRING(REPLACE(renewal."Id"::text, '-', '') FROM 1 FOR 8)),
                       'income', 'membership', member."FullName",
                       renewal."Amount", renewal."Amount", renewal."PaymentMethod",
                       renewal."CreatedAtUtc",
                       'RENEWAL:' || REPLACE(renewal."Id"::text, '-', ''),
                       COALESCE(renewal."Note", 'Backfill thanh toán gia hạn legacy'),
                       'reconciled', renewal."CreatedAtUtc", renewal."UpdatedAtUtc",
                       'Cơ sở chính', 'Migration legacy'
                FROM pickletrack.payment_renewals renewal
                JOIN pickletrack.members member ON member."Id" = renewal."MemberId"
                WHERE renewal."PaymentStatus" = 'paid'
                  AND NOT EXISTS (
                      SELECT 1 FROM pickletrack.finance_entries entry
                      WHERE entry."ReferenceCode" =
                            'RENEWAL:' || REPLACE(renewal."Id"::text, '-', '')
                  );

                INSERT INTO pickletrack.booking_payments (
                    "Id", "BookingId", "ReceiptCode", "Amount", "Method",
                    "PaidAtUtc", "CreatedBy", "CreatedAtUtc", "UpdatedAtUtc")
                SELECT entry."Id",
                       REPLACE(SUBSTRING(entry."ReferenceCode" FROM 9), '-', '')::uuid,
                       entry."Code",
                       entry."Amount",
                       entry."Method",
                       entry."OccurredAtUtc",
                       entry."CreatedBy",
                       entry."CreatedAtUtc",
                       entry."UpdatedAtUtc"
                FROM pickletrack.finance_entries entry
                WHERE entry."Type" = 'income'
                  AND entry."ReferenceCode" LIKE 'BOOKING:%'
                  AND NOT EXISTS (
                      SELECT 1 FROM pickletrack.booking_payments payment
                      WHERE payment."ReceiptCode" = entry."Code"
                  );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "booking_payments",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "inventory_movements",
                schema: "pickletrack");

            migrationBuilder.DropColumn(
                name: "CostAmount",
                schema: "pickletrack",
                table: "pos_sales");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                schema: "pickletrack",
                table: "pos_sales");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                schema: "pickletrack",
                table: "pos_sales");
        }
    }
}
