using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCourtScheduleEntries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "court_schedule_entries",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourtId = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduleType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    OwnerName = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Purpose = table.Column<string>(type: "character varying(240)", maxLength: 240, nullable: false),
                    StartsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    EndsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_court_schedule_entries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_court_schedule_entries_courts_CourtId",
                        column: x => x.CourtId,
                        principalSchema: "pickletrack",
                        principalTable: "courts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_court_schedule_entries_CourtId_StartsAtUtc",
                schema: "pickletrack",
                table: "court_schedule_entries",
                columns: new[] { "CourtId", "StartsAtUtc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "court_schedule_entries",
                schema: "pickletrack");
        }
    }
}
