using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUnifiedCodeFirstModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "class_enrollments",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    EnrolledAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LeftAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Note = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_class_enrollments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_class_enrollments_classes_ClassId",
                        column: x => x.ClassId,
                        principalSchema: "pickletrack",
                        principalTable: "classes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_class_enrollments_members_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "pickletrack",
                        principalTable: "members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_class_enrollments_packages_PackageId",
                        column: x => x.PackageId,
                        principalSchema: "pickletrack",
                        principalTable: "packages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "court_occupancies",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourtId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    SourceId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    EndsAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Title = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    OwnerName = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_court_occupancies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_court_occupancies_courts_CourtId",
                        column: x => x.CourtId,
                        principalSchema: "pickletrack",
                        principalTable: "courts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "equipment_rental_orders",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourtBookingId = table.Column<Guid>(type: "uuid", nullable: true),
                    RentalDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ReceivedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ReturnedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ClosedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_equipment_rental_orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_equipment_rental_orders_court_bookings_CourtBookingId",
                        column: x => x.CourtBookingId,
                        principalSchema: "pickletrack",
                        principalTable: "court_bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_equipment_rental_orders_members_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "pickletrack",
                        principalTable: "members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "invoices",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvoiceCode = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    InvoiceType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CustomerType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CustomerName = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: true),
                    SourceType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    SourceId = table.Column<Guid>(type: "uuid", nullable: true),
                    IssuedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    GrossAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    PaidAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_invoices_members_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "pickletrack",
                        principalTable: "members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "membership_plans",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    DurationMonths = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CanRegisterStudent = table.Column<bool>(type: "boolean", nullable: false),
                    HasPriorityCourtWindow = table.Column<bool>(type: "boolean", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_membership_plans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "payments",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PaymentCode = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Method = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    PaidAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExternalReference = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_payments_users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalSchema: "pickletrack",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "pos_sale_lines",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PosSaleId = table.Column<Guid>(type: "uuid", nullable: false),
                    InventoryItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    ItemNameSnapshot = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    UnitCost = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pos_sale_lines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_pos_sale_lines_inventory_items_InventoryItemId",
                        column: x => x.InventoryItemId,
                        principalSchema: "pickletrack",
                        principalTable: "inventory_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_pos_sale_lines_pos_sales_PosSaleId",
                        column: x => x.PosSaleId,
                        principalSchema: "pickletrack",
                        principalTable: "pos_sales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "package_ledger_entries",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassEnrollmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    SourceType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    SourceId = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionDelta = table.Column<int>(type: "integer", nullable: false),
                    BalanceAfter = table.Column<int>(type: "integer", nullable: true),
                    OccurredAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Note = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_package_ledger_entries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_package_ledger_entries_class_enrollments_ClassEnrollmentId",
                        column: x => x.ClassEnrollmentId,
                        principalSchema: "pickletrack",
                        principalTable: "class_enrollments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_package_ledger_entries_members_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "pickletrack",
                        principalTable: "members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "equipment_rental_order_items",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EquipmentRentalOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    InventoryItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestedQuantity = table.Column<int>(type: "integer", nullable: false),
                    ReceivedQuantity = table.Column<int>(type: "integer", nullable: false),
                    ReturnedQuantity = table.Column<int>(type: "integer", nullable: false),
                    LostQuantity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    SurchargeAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_equipment_rental_order_items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_equipment_rental_order_items_equipment_rental_orders_Equipm~",
                        column: x => x.EquipmentRentalOrderId,
                        principalSchema: "pickletrack",
                        principalTable: "equipment_rental_orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_equipment_rental_order_items_inventory_items_InventoryItemId",
                        column: x => x.InventoryItemId,
                        principalSchema: "pickletrack",
                        principalTable: "inventory_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "invoice_lines",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvoiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    LineType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Description = table.Column<string>(type: "character varying(240)", maxLength: 240, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    UnitAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    SourceType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    SourceId = table.Column<Guid>(type: "uuid", nullable: true),
                    InventoryItemId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoice_lines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_invoice_lines_inventory_items_InventoryItemId",
                        column: x => x.InventoryItemId,
                        principalSchema: "pickletrack",
                        principalTable: "inventory_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_invoice_lines_invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalSchema: "pickletrack",
                        principalTable: "invoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "refunds",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RefundCode = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    InvoiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RefundedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refunds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_refunds_invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalSchema: "pickletrack",
                        principalTable: "invoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_refunds_users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalSchema: "pickletrack",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "membership_plan_benefits",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MembershipPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    BenefitCode = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Label = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    ValueText = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsHighlighted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_membership_plan_benefits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_membership_plan_benefits_membership_plans_MembershipPlanId",
                        column: x => x.MembershipPlanId,
                        principalSchema: "pickletrack",
                        principalTable: "membership_plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "membership_requests",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    MembershipPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    RequestType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    RequestedStartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Note = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ReviewedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ReviewedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ReviewNote = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_membership_requests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_membership_requests_members_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "pickletrack",
                        principalTable: "members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_membership_requests_membership_plans_MembershipPlanId",
                        column: x => x.MembershipPlanId,
                        principalSchema: "pickletrack",
                        principalTable: "membership_plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_membership_requests_users_ReviewedByUserId",
                        column: x => x.ReviewedByUserId,
                        principalSchema: "pickletrack",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "payment_allocations",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PaymentId = table.Column<Guid>(type: "uuid", nullable: false),
                    InvoiceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Note = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payment_allocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_payment_allocations_invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalSchema: "pickletrack",
                        principalTable: "invoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_payment_allocations_payments_PaymentId",
                        column: x => x.PaymentId,
                        principalSchema: "pickletrack",
                        principalTable: "payments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "membership_subscriptions",
                schema: "pickletrack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    MembershipPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    MembershipRequestId = table.Column<Guid>(type: "uuid", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    IsCurrent = table.Column<bool>(type: "boolean", nullable: false),
                    ActivatedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ActivatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CancelledAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_membership_subscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_membership_subscriptions_members_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "pickletrack",
                        principalTable: "members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_membership_subscriptions_membership_plans_MembershipPlanId",
                        column: x => x.MembershipPlanId,
                        principalSchema: "pickletrack",
                        principalTable: "membership_plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_membership_subscriptions_membership_requests_MembershipRequ~",
                        column: x => x.MembershipRequestId,
                        principalSchema: "pickletrack",
                        principalTable: "membership_requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_membership_subscriptions_users_ActivatedByUserId",
                        column: x => x.ActivatedByUserId,
                        principalSchema: "pickletrack",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_renewal_requests_PackageId",
                schema: "pickletrack",
                table: "renewal_requests",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_payment_renewals_PackageId",
                schema: "pickletrack",
                table: "payment_renewals",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_court_bookings_AppliedMembershipRenewalId",
                schema: "pickletrack",
                table: "court_bookings",
                column: "AppliedMembershipRenewalId");

            migrationBuilder.CreateIndex(
                name: "IX_court_bookings_MemberId",
                schema: "pickletrack",
                table: "court_bookings",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_attendance_records_MemberId",
                schema: "pickletrack",
                table: "attendance_records",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_class_enrollments_ClassId_MemberId",
                schema: "pickletrack",
                table: "class_enrollments",
                columns: new[] { "ClassId", "MemberId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_class_enrollments_MemberId_Status",
                schema: "pickletrack",
                table: "class_enrollments",
                columns: new[] { "MemberId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_class_enrollments_PackageId",
                schema: "pickletrack",
                table: "class_enrollments",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_court_occupancies_CourtId_StartsAtUtc",
                schema: "pickletrack",
                table: "court_occupancies",
                columns: new[] { "CourtId", "StartsAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_court_occupancies_SourceType_SourceId",
                schema: "pickletrack",
                table: "court_occupancies",
                columns: new[] { "SourceType", "SourceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_equipment_rental_order_items_EquipmentRentalOrderId_Invento~",
                schema: "pickletrack",
                table: "equipment_rental_order_items",
                columns: new[] { "EquipmentRentalOrderId", "InventoryItemId" });

            migrationBuilder.CreateIndex(
                name: "IX_equipment_rental_order_items_InventoryItemId",
                schema: "pickletrack",
                table: "equipment_rental_order_items",
                column: "InventoryItemId");

            migrationBuilder.CreateIndex(
                name: "IX_equipment_rental_orders_CourtBookingId",
                schema: "pickletrack",
                table: "equipment_rental_orders",
                column: "CourtBookingId");

            migrationBuilder.CreateIndex(
                name: "IX_equipment_rental_orders_MemberId_RentalDate",
                schema: "pickletrack",
                table: "equipment_rental_orders",
                columns: new[] { "MemberId", "RentalDate" });

            migrationBuilder.CreateIndex(
                name: "IX_invoice_lines_InventoryItemId",
                schema: "pickletrack",
                table: "invoice_lines",
                column: "InventoryItemId");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_lines_InvoiceId_LineType",
                schema: "pickletrack",
                table: "invoice_lines",
                columns: new[] { "InvoiceId", "LineType" });

            migrationBuilder.CreateIndex(
                name: "IX_invoices_InvoiceCode",
                schema: "pickletrack",
                table: "invoices",
                column: "InvoiceCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_invoices_MemberId_IssuedAtUtc",
                schema: "pickletrack",
                table: "invoices",
                columns: new[] { "MemberId", "IssuedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_invoices_SourceType_SourceId",
                schema: "pickletrack",
                table: "invoices",
                columns: new[] { "SourceType", "SourceId" });

            migrationBuilder.CreateIndex(
                name: "IX_membership_plan_benefits_MembershipPlanId_BenefitCode",
                schema: "pickletrack",
                table: "membership_plan_benefits",
                columns: new[] { "MembershipPlanId", "BenefitCode" });

            migrationBuilder.CreateIndex(
                name: "IX_membership_plans_Code",
                schema: "pickletrack",
                table: "membership_plans",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_membership_plans_IsActive_DisplayOrder",
                schema: "pickletrack",
                table: "membership_plans",
                columns: new[] { "IsActive", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_membership_requests_MemberId_Status",
                schema: "pickletrack",
                table: "membership_requests",
                columns: new[] { "MemberId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_membership_requests_MembershipPlanId",
                schema: "pickletrack",
                table: "membership_requests",
                column: "MembershipPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_membership_requests_ReviewedByUserId",
                schema: "pickletrack",
                table: "membership_requests",
                column: "ReviewedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_membership_subscriptions_ActivatedByUserId",
                schema: "pickletrack",
                table: "membership_subscriptions",
                column: "ActivatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_membership_subscriptions_MemberId_IsCurrent",
                schema: "pickletrack",
                table: "membership_subscriptions",
                columns: new[] { "MemberId", "IsCurrent" });

            migrationBuilder.CreateIndex(
                name: "IX_membership_subscriptions_MembershipPlanId_Status",
                schema: "pickletrack",
                table: "membership_subscriptions",
                columns: new[] { "MembershipPlanId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_membership_subscriptions_MembershipRequestId",
                schema: "pickletrack",
                table: "membership_subscriptions",
                column: "MembershipRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_package_ledger_entries_ClassEnrollmentId",
                schema: "pickletrack",
                table: "package_ledger_entries",
                column: "ClassEnrollmentId");

            migrationBuilder.CreateIndex(
                name: "IX_package_ledger_entries_MemberId_OccurredAtUtc",
                schema: "pickletrack",
                table: "package_ledger_entries",
                columns: new[] { "MemberId", "OccurredAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_package_ledger_entries_SourceType_SourceId",
                schema: "pickletrack",
                table: "package_ledger_entries",
                columns: new[] { "SourceType", "SourceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_payment_allocations_InvoiceId",
                schema: "pickletrack",
                table: "payment_allocations",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_payment_allocations_PaymentId_InvoiceId",
                schema: "pickletrack",
                table: "payment_allocations",
                columns: new[] { "PaymentId", "InvoiceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_payments_CreatedByUserId",
                schema: "pickletrack",
                table: "payments",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_payments_PaidAtUtc_Status",
                schema: "pickletrack",
                table: "payments",
                columns: new[] { "PaidAtUtc", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_payments_PaymentCode",
                schema: "pickletrack",
                table: "payments",
                column: "PaymentCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_pos_sale_lines_InventoryItemId",
                schema: "pickletrack",
                table: "pos_sale_lines",
                column: "InventoryItemId");

            migrationBuilder.CreateIndex(
                name: "IX_pos_sale_lines_PosSaleId_InventoryItemId",
                schema: "pickletrack",
                table: "pos_sale_lines",
                columns: new[] { "PosSaleId", "InventoryItemId" });

            migrationBuilder.CreateIndex(
                name: "IX_refunds_CreatedByUserId",
                schema: "pickletrack",
                table: "refunds",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_refunds_InvoiceId_RefundedAtUtc",
                schema: "pickletrack",
                table: "refunds",
                columns: new[] { "InvoiceId", "RefundedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_refunds_RefundCode",
                schema: "pickletrack",
                table: "refunds",
                column: "RefundCode",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_attendance_records_members_MemberId",
                schema: "pickletrack",
                table: "attendance_records",
                column: "MemberId",
                principalSchema: "pickletrack",
                principalTable: "members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_attendance_records_sessions_SessionId",
                schema: "pickletrack",
                table: "attendance_records",
                column: "SessionId",
                principalSchema: "pickletrack",
                principalTable: "sessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_booking_charges_court_bookings_BookingId",
                schema: "pickletrack",
                table: "booking_charges",
                column: "BookingId",
                principalSchema: "pickletrack",
                principalTable: "court_bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_booking_payments_court_bookings_BookingId",
                schema: "pickletrack",
                table: "booking_payments",
                column: "BookingId",
                principalSchema: "pickletrack",
                principalTable: "court_bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_classes_coaches_CoachId",
                schema: "pickletrack",
                table: "classes",
                column: "CoachId",
                principalSchema: "pickletrack",
                principalTable: "coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_coach_settlements_coaches_CoachId",
                schema: "pickletrack",
                table: "coach_settlements",
                column: "CoachId",
                principalSchema: "pickletrack",
                principalTable: "coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_coaches_users_UserId",
                schema: "pickletrack",
                table: "coaches",
                column: "UserId",
                principalSchema: "pickletrack",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_court_bookings_courts_CourtId",
                schema: "pickletrack",
                table: "court_bookings",
                column: "CourtId",
                principalSchema: "pickletrack",
                principalTable: "courts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_court_bookings_members_MemberId",
                schema: "pickletrack",
                table: "court_bookings",
                column: "MemberId",
                principalSchema: "pickletrack",
                principalTable: "members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_court_bookings_payment_renewals_AppliedMembershipRenewalId",
                schema: "pickletrack",
                table: "court_bookings",
                column: "AppliedMembershipRenewalId",
                principalSchema: "pickletrack",
                principalTable: "payment_renewals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_inventory_movements_inventory_items_InventoryItemId",
                schema: "pickletrack",
                table: "inventory_movements",
                column: "InventoryItemId",
                principalSchema: "pickletrack",
                principalTable: "inventory_items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_members_users_UserId",
                schema: "pickletrack",
                table: "members",
                column: "UserId",
                principalSchema: "pickletrack",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_payment_renewals_members_MemberId",
                schema: "pickletrack",
                table: "payment_renewals",
                column: "MemberId",
                principalSchema: "pickletrack",
                principalTable: "members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_payment_renewals_packages_PackageId",
                schema: "pickletrack",
                table: "payment_renewals",
                column: "PackageId",
                principalSchema: "pickletrack",
                principalTable: "packages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_pos_sales_court_bookings_BookingId",
                schema: "pickletrack",
                table: "pos_sales",
                column: "BookingId",
                principalSchema: "pickletrack",
                principalTable: "court_bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_renewal_requests_members_MemberId",
                schema: "pickletrack",
                table: "renewal_requests",
                column: "MemberId",
                principalSchema: "pickletrack",
                principalTable: "members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_renewal_requests_packages_PackageId",
                schema: "pickletrack",
                table: "renewal_requests",
                column: "PackageId",
                principalSchema: "pickletrack",
                principalTable: "packages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_sessions_classes_ClassId",
                schema: "pickletrack",
                table: "sessions",
                column: "ClassId",
                principalSchema: "pickletrack",
                principalTable: "classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_attendance_records_members_MemberId",
                schema: "pickletrack",
                table: "attendance_records");

            migrationBuilder.DropForeignKey(
                name: "FK_attendance_records_sessions_SessionId",
                schema: "pickletrack",
                table: "attendance_records");

            migrationBuilder.DropForeignKey(
                name: "FK_booking_charges_court_bookings_BookingId",
                schema: "pickletrack",
                table: "booking_charges");

            migrationBuilder.DropForeignKey(
                name: "FK_booking_payments_court_bookings_BookingId",
                schema: "pickletrack",
                table: "booking_payments");

            migrationBuilder.DropForeignKey(
                name: "FK_classes_coaches_CoachId",
                schema: "pickletrack",
                table: "classes");

            migrationBuilder.DropForeignKey(
                name: "FK_coach_settlements_coaches_CoachId",
                schema: "pickletrack",
                table: "coach_settlements");

            migrationBuilder.DropForeignKey(
                name: "FK_coaches_users_UserId",
                schema: "pickletrack",
                table: "coaches");

            migrationBuilder.DropForeignKey(
                name: "FK_court_bookings_courts_CourtId",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_court_bookings_members_MemberId",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_court_bookings_payment_renewals_AppliedMembershipRenewalId",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_inventory_movements_inventory_items_InventoryItemId",
                schema: "pickletrack",
                table: "inventory_movements");

            migrationBuilder.DropForeignKey(
                name: "FK_members_users_UserId",
                schema: "pickletrack",
                table: "members");

            migrationBuilder.DropForeignKey(
                name: "FK_payment_renewals_members_MemberId",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropForeignKey(
                name: "FK_payment_renewals_packages_PackageId",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropForeignKey(
                name: "FK_pos_sales_court_bookings_BookingId",
                schema: "pickletrack",
                table: "pos_sales");

            migrationBuilder.DropForeignKey(
                name: "FK_renewal_requests_members_MemberId",
                schema: "pickletrack",
                table: "renewal_requests");

            migrationBuilder.DropForeignKey(
                name: "FK_renewal_requests_packages_PackageId",
                schema: "pickletrack",
                table: "renewal_requests");

            migrationBuilder.DropForeignKey(
                name: "FK_sessions_classes_ClassId",
                schema: "pickletrack",
                table: "sessions");

            migrationBuilder.DropTable(
                name: "court_occupancies",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "equipment_rental_order_items",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "invoice_lines",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "membership_plan_benefits",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "membership_subscriptions",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "package_ledger_entries",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "payment_allocations",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "pos_sale_lines",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "refunds",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "equipment_rental_orders",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "membership_requests",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "class_enrollments",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "payments",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "invoices",
                schema: "pickletrack");

            migrationBuilder.DropTable(
                name: "membership_plans",
                schema: "pickletrack");

            migrationBuilder.DropIndex(
                name: "IX_renewal_requests_PackageId",
                schema: "pickletrack",
                table: "renewal_requests");

            migrationBuilder.DropIndex(
                name: "IX_payment_renewals_PackageId",
                schema: "pickletrack",
                table: "payment_renewals");

            migrationBuilder.DropIndex(
                name: "IX_court_bookings_AppliedMembershipRenewalId",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropIndex(
                name: "IX_court_bookings_MemberId",
                schema: "pickletrack",
                table: "court_bookings");

            migrationBuilder.DropIndex(
                name: "IX_attendance_records_MemberId",
                schema: "pickletrack",
                table: "attendance_records");
        }
    }
}
