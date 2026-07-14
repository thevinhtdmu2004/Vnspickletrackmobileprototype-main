using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CompleteAdminLifecycle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCancelled",
                schema: "pickletrack",
                table: "finance_debts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCancelled",
                schema: "pickletrack",
                table: "finance_debts");
        }
    }
}
