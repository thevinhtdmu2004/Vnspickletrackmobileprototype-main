using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BackfillGeneralDebtCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE pickletrack.finance_debts
                SET "CounterpartyType" = CASE
                    WHEN "SourceType" = 'coachSettlement' THEN 'coach'
                    WHEN "SourceType" = 'memberRenewal' THEN 'member'
                    WHEN "SourceType" = 'courtBooking' THEN 'booking'
                    WHEN "Description" ILIKE '%học phí%'
                      OR "Description" ILIKE '%gói%' THEN 'member'
                    WHEN "Description" ILIKE '%thuê sân%'
                      OR "Description" ILIKE '%booking%' THEN 'booking'
                    WHEN "Counterparty" ILIKE '%nhà cung cấp%'
                      OR "Counterparty" ILIKE '%điện lực%' THEN 'supplier'
                    ELSE 'other'
                END;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
