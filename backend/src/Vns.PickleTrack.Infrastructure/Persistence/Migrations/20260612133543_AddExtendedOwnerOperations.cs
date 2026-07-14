using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExtendedOwnerOperations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "content_items",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: true),
                    Summary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_content_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "inventory_items",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Sku = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Category = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    SalePrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CostPrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    ReorderLevel = table.Column<int>(type: "integer", nullable: false),
                    RentalTotal = table.Column<int>(type: "integer", nullable: false),
                    RentalInUse = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inventory_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "pos_sales",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: true),
                    TotalAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ItemsJson = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pos_sales", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "promotions",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MemberGroup = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    BenefitType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    BenefitValue = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    StartsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    EndsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Conditions = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_promotions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "shift_handovers",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ShiftId = table.Column<Guid>(type: "uuid", nullable: false),
                    HandedOverBy = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    ReceivedBy = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    OpeningCash = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ClosingCash = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    InventoryChecked = table.Column<bool>(type: "boolean", nullable: false),
                    IncidentNote = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CompletedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_shift_handovers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "staff_shifts",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StaffName = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    StartsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    EndsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_staff_shifts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_content_items_Status_PackageId",
                schema: "pickletrack",
                table: "content_items",
                columns: new[] { "Status", "PackageId" });

            migrationBuilder.CreateIndex(
                name: "IX_inventory_items_Sku",
                schema: "pickletrack",
                table: "inventory_items",
                column: "Sku",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_pos_sales_BookingId",
                schema: "pickletrack",
                table: "pos_sales",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_pos_sales_Code",
                schema: "pickletrack",
                table: "pos_sales",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_promotions_MemberGroup_StartsAtUtc_EndsAtUtc",
                schema: "pickletrack",
                table: "promotions",
                columns: new[] { "MemberGroup", "StartsAtUtc", "EndsAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_shift_handovers_ShiftId",
                schema: "pickletrack",
                table: "shift_handovers",
                column: "ShiftId");

            migrationBuilder.CreateIndex(
                name: "IX_staff_shifts_StartsAtUtc_EndsAtUtc",
                schema: "pickletrack",
                table: "staff_shifts",
                columns: new[] { "StartsAtUtc", "EndsAtUtc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "content_items",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "inventory_items",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "pos_sales",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "promotions",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "shift_handovers",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "staff_shifts",
                schema: "pickletrack");
        }
    }
}
