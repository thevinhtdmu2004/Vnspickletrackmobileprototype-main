using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UnifyBookingLifecycle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdempotencyKey",
                schema: "pickletrack",
                table: "pos_sales",
                type: "character varying(80)",
                maxLength: 80,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BookingCode",
                schema: "pickletrack",
                table: "court_bookings",
                type: "character varying(24)",
                maxLength: 24,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomerType",
                schema: "pickletrack",
                table: "court_bookings",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "guest");

            migrationBuilder.AddColumn<string>(
                name: "Note",
                schema: "pickletrack",
                table: "booking_payments",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TransactionType",
                schema: "pickletrack",
                table: "booking_payments",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "payment");

            migrationBuilder.Sql("""
                UPDATE pickletrack.court_bookings
                SET "BookingCode" = 'BK-' || UPPER(SUBSTRING(REPLACE("Id"::text, '-', '') FROM 1 FOR 8))
                WHERE "BookingCode" = '';

                UPDATE pickletrack.pos_sales
                SET "IdempotencyKey" = 'LEGACY:' || REPLACE("Id"::text, '-', '')
                WHERE "IdempotencyKey" = '';
                """);

            migrationBuilder.CreateIndex(
                name: "IX_pos_sales_IdempotencyKey",
                schema: "pickletrack",
                table: "pos_sales",
                column: "IdempotencyKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_inventory_movements_InventoryItemId_ReferenceCode_MovementT~",
                schema: "pickletrack",
                table: "inventory_movements",
                columns: new[] { "InventoryItemId", "ReferenceCode", "MovementType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_court_bookings_BookingCode",
                schema: "pickletrack",
                table: "court_bookings",
                column: "BookingCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_pos_sales_IdempotencyKey",
                schema: "pickletrack",
                table: "pos_sales");

            migrationBuilder.DropIndex(
                name: "IX_inventory_movements_InventoryItemId_ReferenceCode_MovementT~",
                schema: "pickletrack",
                table: "inventory_movements");

            migrationBuilder.DropIndex(
                name: "IX_court_bookings_BookingCode",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "IdempotencyKey",
                schema: "pickletrack",
                table: "pos_sales");

            migrationBuilder.DropColumn(
                name: "BookingCode",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "CustomerType",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "Note",
                schema: "pickletrack",
                table: "booking_payments");

            migrationBuilder.DropColumn(
                name: "TransactionType",
                schema: "pickletrack",
                table: "booking_payments");
        }
    }
}
