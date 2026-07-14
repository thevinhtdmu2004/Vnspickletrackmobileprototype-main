using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCourtManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                schema: "pickletrack",
                table: "courts",
                type: "integer",
                nullable: false,
                defaultValue: 4);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "ClosesAt",
                schema: "pickletrack",
                table: "courts",
                type: "time without time zone",
                nullable: false,
                defaultValue: new TimeOnly(23, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "CourtType",
                schema: "pickletrack",
                table: "courts",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                defaultValue: "standard");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "pickletrack",
                table: "courts",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeOnly>(
                name: "OpensAt",
                schema: "pickletrack",
                table: "courts",
                type: "time without time zone",
                nullable: false,
                defaultValue: new TimeOnly(5, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "OperationalStatus",
                schema: "pickletrack",
                table: "courts",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "available");

            migrationBuilder.CreateIndex(
                name: "IX_courts_OperationalStatus",
                schema: "pickletrack",
                table: "courts",
                column: "OperationalStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_courts_OperationalStatus",
                schema: "pickletrack",
                table: "courts");

            migrationBuilder.DropColumn(
                name: "Capacity",
                schema: "pickletrack",
                table: "courts");

            migrationBuilder.DropColumn(
                name: "ClosesAt",
                schema: "pickletrack",
                table: "courts");

            migrationBuilder.DropColumn(
                name: "CourtType",
                schema: "pickletrack",
                table: "courts");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "pickletrack",
                table: "courts");

            migrationBuilder.DropColumn(
                name: "OpensAt",
                schema: "pickletrack",
                table: "courts");

            migrationBuilder.DropColumn(
                name: "OperationalStatus",
                schema: "pickletrack",
                table: "courts");
        }
    }
}
