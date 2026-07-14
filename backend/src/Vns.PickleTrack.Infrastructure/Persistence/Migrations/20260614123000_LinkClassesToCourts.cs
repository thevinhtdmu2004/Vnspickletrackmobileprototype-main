using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations;

[DbContext(typeof(PickleTrackDbContext))]
[Migration("20260614123000_LinkClassesToCourts")]
public sealed class LinkClassesToCourts : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<Guid>(
            name: "CourtId",
            schema: "pickletrack",
            table: "classes",
            type: "uuid",
            nullable: true);

        migrationBuilder.Sql(
            """
            UPDATE pickletrack.classes AS class
            SET "CourtId" = court."Id"
            FROM pickletrack.courts AS court
            WHERE class."CourtId" IS NULL
              AND class."CourtName" IS NOT NULL
              AND LOWER(class."CourtName") = LOWER(court."Name");
            """);

        migrationBuilder.CreateIndex(
            name: "IX_classes_CourtId",
            schema: "pickletrack",
            table: "classes",
            column: "CourtId");

        migrationBuilder.AddForeignKey(
            name: "FK_classes_courts_CourtId",
            schema: "pickletrack",
            table: "classes",
            column: "CourtId",
            principalSchema: "pickletrack",
            principalTable: "courts",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_classes_courts_CourtId",
            schema: "pickletrack",
            table: "classes");

        migrationBuilder.DropIndex(
            name: "IX_classes_CourtId",
            schema: "pickletrack",
            table: "classes");

        migrationBuilder.DropColumn(
            name: "CourtId",
            schema: "pickletrack",
            table: "classes");
    }
}
