using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeparateCoachReconciliationDebt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SourceId",
                schema: "pickletrack",
                table: "finance_debts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceType",
                schema: "pickletrack",
                table: "finance_debts",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ConfirmedAtUtc",
                schema: "pickletrack",
                table: "coach_settlements",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConfirmedBy",
                schema: "pickletrack",
                table: "coach_settlements",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsConfirmed",
                schema: "pickletrack",
                table: "coach_settlements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_finance_debts_SourceType_SourceId",
                schema: "pickletrack",
                table: "finance_debts",
                columns: new[] { "SourceType", "SourceId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_finance_debts_SourceType_SourceId",
                schema: "pickletrack",
                table: "finance_debts");

            migrationBuilder.DropColumn(
                name: "SourceId",
                schema: "pickletrack",
                table: "finance_debts");

            migrationBuilder.DropColumn(
                name: "SourceType",
                schema: "pickletrack",
                table: "finance_debts");

            migrationBuilder.DropColumn(
                name: "ConfirmedAtUtc",
                schema: "pickletrack",
                table: "coach_settlements");

            migrationBuilder.DropColumn(
                name: "ConfirmedBy",
                schema: "pickletrack",
                table: "coach_settlements");

            migrationBuilder.DropColumn(
                name: "IsConfirmed",
                schema: "pickletrack",
                table: "coach_settlements");
        }
    }
}
