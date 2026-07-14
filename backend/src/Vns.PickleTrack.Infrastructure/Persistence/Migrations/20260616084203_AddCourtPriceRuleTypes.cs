using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCourtPriceRuleTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_court_price_rules_CourtId_CustomerType_DayType_EffectiveFro~",
                schema: "pickletrack",
                table: "court_price_rules");

            migrationBuilder.AddColumn<string>(
                name: "HolidayDates",
                schema: "pickletrack",
                table: "court_price_rules",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PriceType",
                schema: "pickletrack",
                table: "court_price_rules",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "regular");

            migrationBuilder.Sql("""
                UPDATE pickletrack.court_price_rules
                SET "PriceType" = 'peak'
                WHERE "CustomerType" = 'guest'
                  AND "DayType" = 'weekday'
                  AND "StartTime" >= TIME '17:00';
                """);

            migrationBuilder.CreateIndex(
                name: "IX_court_price_rules_CourtId_PriceType_CustomerType_DayType_Ef~",
                schema: "pickletrack",
                table: "court_price_rules",
                columns: new[] { "CourtId", "PriceType", "CustomerType", "DayType", "EffectiveFrom", "StartTime" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_court_price_rules_CourtId_PriceType_CustomerType_DayType_Ef~",
                schema: "pickletrack",
                table: "court_price_rules");

            migrationBuilder.DropColumn(
                name: "HolidayDates",
                schema: "pickletrack",
                table: "court_price_rules");

            migrationBuilder.DropColumn(
                name: "PriceType",
                schema: "pickletrack",
                table: "court_price_rules");

            migrationBuilder.CreateIndex(
                name: "IX_court_price_rules_CourtId_CustomerType_DayType_EffectiveFro~",
                schema: "pickletrack",
                table: "court_price_rules",
                columns: new[] { "CourtId", "CustomerType", "DayType", "EffectiveFrom", "StartTime" });
        }
    }
}
