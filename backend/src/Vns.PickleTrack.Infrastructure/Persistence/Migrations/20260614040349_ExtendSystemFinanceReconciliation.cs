using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ExtendSystemFinanceReconciliation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BranchName",
                schema: "pickletrack",
                table: "finance_entries",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "Cơ sở chính");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ConfirmedAtUtc",
                schema: "pickletrack",
                table: "finance_entries",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConfirmedBy",
                schema: "pickletrack",
                table: "finance_entries",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "pickletrack",
                table: "finance_entries",
                type: "character varying(160)",
                maxLength: 160,
                nullable: false,
                defaultValue: "Hệ thống");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BranchName",
                schema: "pickletrack",
                table: "finance_entries");

            migrationBuilder.DropColumn(
                name: "ConfirmedAtUtc",
                schema: "pickletrack",
                table: "finance_entries");

            migrationBuilder.DropColumn(
                name: "ConfirmedBy",
                schema: "pickletrack",
                table: "finance_entries");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "pickletrack",
                table: "finance_entries");
        }
    }
}
