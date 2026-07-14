using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddContentReviewAudit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                schema: "pickletrack",
                table: "content_items",
                type: "character varying(160)",
                maxLength: 160,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                schema: "pickletrack",
                table: "content_items",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ReviewedAtUtc",
                schema: "pickletrack",
                table: "content_items",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReviewedByName",
                schema: "pickletrack",
                table: "content_items",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByName",
                schema: "pickletrack",
                table: "content_items");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                schema: "pickletrack",
                table: "content_items");

            migrationBuilder.DropColumn(
                name: "ReviewedAtUtc",
                schema: "pickletrack",
                table: "content_items");

            migrationBuilder.DropColumn(
                name: "ReviewedByName",
                schema: "pickletrack",
                table: "content_items");
        }
    }
}
