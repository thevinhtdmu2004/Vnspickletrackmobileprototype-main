using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMembershipCourtBenefits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ActivatedAtUtc",
                schema: "pickletrack",
                table: "payment_renewals",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ExpiresAtUtc",
                schema: "pickletrack",
                table: "payment_renewals",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<int>(
                name: "FreeCourtUsesGranted",
                schema: "pickletrack",
                table: "payment_renewals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FreeCourtUsesUsed",
                schema: "pickletrack",
                table: "payment_renewals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FreeCourtMinutesPerUse",
                schema: "pickletrack",
                table: "packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FreeCourtUses",
                schema: "pickletrack",
                table: "packages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ValidityDays",
                schema: "pickletrack",
                table: "packages",
                type: "integer",
                nullable: false,
                defaultValue: 30);

            migrationBuilder.AddColumn<Guid>(
                name: "AppliedMembershipRenewalId",
                schema: "pickletrack",
                table: "court_bookings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CourtAmountBeforeBenefit",
                schema: "pickletrack",
                table: "court_bookings",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CourtBenefitDiscount",
                schema: "pickletrack",
                table: "court_bookings",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "MemberId",
                schema: "pickletrack",
                table: "court_bookings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "MembershipBenefitExpiresAtUtc",
                schema: "pickletrack",
                table: "court_bookings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MembershipBenefitNote",
                schema: "pickletrack",
                table: "court_bookings",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MembershipBenefitUsesRemainingAfterApply",
                schema: "pickletrack",
                table: "court_bookings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MembershipPackageName",
                schema: "pickletrack",
                table: "court_bookings",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE pickletrack.court_bookings
                SET "CourtAmountBeforeBenefit" = "Amount";

                UPDATE pickletrack.payment_renewals
                SET "ActivatedAtUtc" = "CreatedAtUtc",
                    "ExpiresAtUtc" = "CreatedAtUtc" + INTERVAL '30 days';
                """);

            migrationBuilder.CreateIndex(
                name: "IX_payment_renewals_MemberId_ExpiresAtUtc",
                schema: "pickletrack",
                table: "payment_renewals",
                columns: new[] { "MemberId", "ExpiresAtUtc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_payment_renewals_MemberId_ExpiresAtUtc",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "ActivatedAtUtc",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "ExpiresAtUtc",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "FreeCourtUsesGranted",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "FreeCourtUsesUsed",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropColumn(
                name: "FreeCourtMinutesPerUse",
                schema: "pickletrack",
                table: "packages");

            migrationBuilder.DropColumn(
                name: "FreeCourtUses",
                schema: "pickletrack",
                table: "packages");

            migrationBuilder.DropColumn(
                name: "ValidityDays",
                schema: "pickletrack",
                table: "packages");

            migrationBuilder.DropColumn(
                name: "AppliedMembershipRenewalId",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "CourtAmountBeforeBenefit",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "CourtBenefitDiscount",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "MemberId",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "MembershipBenefitExpiresAtUtc",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "MembershipBenefitNote",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "MembershipBenefitUsesRemainingAfterApply",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropColumn(
                name: "MembershipPackageName",
                schema: "pickletrack",
                table: "court_bookings");
        }
    }
}
