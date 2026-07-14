DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'pickletrack') THEN
        CREATE SCHEMA pickletrack;
    END IF;
END $EF$;
CREATE TABLE IF NOT EXISTS pickletrack.__ef_migrations_history (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___ef_migrations_history" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'pickletrack') THEN
        CREATE SCHEMA pickletrack;
    END IF;
END $EF$;

CREATE TABLE pickletrack.attendance_records (
    "Id" uuid NOT NULL,
    "SessionId" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "Status" character varying(20) NOT NULL,
    "DeductsSession" boolean NOT NULL,
    "Note" character varying(500),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_attendance_records" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.classes (
    "Id" uuid NOT NULL,
    "Name" character varying(160) NOT NULL,
    "CoachId" uuid NOT NULL,
    "CourtName" character varying(120),
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_classes" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.coaches (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "FullName" character varying(160) NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_coaches" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.members (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "FullName" character varying(160) NOT NULL,
    "PhoneNumber" character varying(30) NOT NULL,
    "SkillLevel" character varying(80),
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_members" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.packages (
    "Id" uuid NOT NULL,
    "Name" character varying(160) NOT NULL,
    "SessionCount" integer NOT NULL,
    "Price" numeric(18,2) NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_packages" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.payment_renewals (
    "Id" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "PackageId" uuid NOT NULL,
    "SessionsAdded" integer NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_payment_renewals" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.renewal_requests (
    "Id" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "PackageId" uuid NOT NULL,
    "Status" character varying(20) NOT NULL,
    "Note" character varying(500),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_renewal_requests" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.sessions (
    "Id" uuid NOT NULL,
    "ClassId" uuid NOT NULL,
    "StartsAtUtc" timestamp with time zone NOT NULL,
    "EndsAtUtc" timestamp with time zone NOT NULL,
    "IsCompleted" boolean NOT NULL,
    "IsCancelled" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_sessions" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.users (
    "Id" uuid NOT NULL,
    "Username" character varying(80) NOT NULL,
    "DisplayName" character varying(160) NOT NULL,
    "PinHash" character varying(500) NOT NULL,
    "Role" character varying(20) NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_users" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX "IX_attendance_records_SessionId_MemberId" ON pickletrack.attendance_records ("SessionId", "MemberId");

CREATE INDEX "IX_classes_CoachId" ON pickletrack.classes ("CoachId");

CREATE UNIQUE INDEX "IX_coaches_UserId" ON pickletrack.coaches ("UserId");

CREATE UNIQUE INDEX "IX_members_UserId" ON pickletrack.members ("UserId");

CREATE INDEX "IX_payment_renewals_MemberId" ON pickletrack.payment_renewals ("MemberId");

CREATE INDEX "IX_renewal_requests_MemberId_Status" ON pickletrack.renewal_requests ("MemberId", "Status");

CREATE INDEX "IX_sessions_ClassId_StartsAtUtc" ON pickletrack.sessions ("ClassId", "StartsAtUtc");

CREATE UNIQUE INDEX "IX_users_Username" ON pickletrack.users ("Username");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260611145954_InitialCreate', '10.0.4');

COMMIT;

START TRANSACTION;
CREATE TABLE pickletrack.court_bookings (
    "Id" uuid NOT NULL,
    "CourtId" uuid NOT NULL,
    "CustomerName" character varying(160) NOT NULL,
    "CustomerPhone" character varying(30) NOT NULL,
    "StartsAtUtc" timestamp with time zone NOT NULL,
    "EndsAtUtc" timestamp with time zone NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "Status" character varying(30) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_court_bookings" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.courts (
    "Id" uuid NOT NULL,
    "Name" character varying(120) NOT NULL,
    "Surface" character varying(80) NOT NULL,
    "HourlyRate" numeric(18,2) NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_courts" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_court_bookings_CourtId_StartsAtUtc" ON pickletrack.court_bookings ("CourtId", "StartsAtUtc");

CREATE UNIQUE INDEX "IX_courts_Name" ON pickletrack.courts ("Name");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260611150000_AddCourtOperations', '10.0.4');

COMMIT;

START TRANSACTION;
CREATE TABLE pickletrack.finance_debts (
    "Id" uuid NOT NULL,
    "Direction" character varying(20) NOT NULL,
    "Counterparty" character varying(160) NOT NULL,
    "Description" character varying(300) NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "PaidAmount" numeric(18,2) NOT NULL,
    "DueAtUtc" timestamp with time zone NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_finance_debts" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.finance_entries (
    "Id" uuid NOT NULL,
    "Code" character varying(40) NOT NULL,
    "Type" character varying(20) NOT NULL,
    "Category" character varying(40) NOT NULL,
    "Counterparty" character varying(160) NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "ActualAmount" numeric(18,2),
    "Method" character varying(30) NOT NULL,
    "OccurredAtUtc" timestamp with time zone NOT NULL,
    "ReferenceCode" character varying(80),
    "Note" character varying(500),
    "ReconciliationStatus" character varying(30) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_finance_entries" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_finance_debts_Direction_DueAtUtc" ON pickletrack.finance_debts ("Direction", "DueAtUtc");

CREATE UNIQUE INDEX "IX_finance_entries_Code" ON pickletrack.finance_entries ("Code");

CREATE INDEX "IX_finance_entries_OccurredAtUtc_Type" ON pickletrack.finance_entries ("OccurredAtUtc", "Type");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260612044802_AddFinanceOperations', '10.0.4');

COMMIT;

START TRANSACTION;
CREATE TABLE pickletrack.content_items (
    "Id" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "ContentType" character varying(40) NOT NULL,
    "Status" character varying(30) NOT NULL,
    "PackageId" uuid,
    "Summary" character varying(1000) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_content_items" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.inventory_items (
    "Id" uuid NOT NULL,
    "Sku" character varying(40) NOT NULL,
    "Name" character varying(160) NOT NULL,
    "Category" character varying(40) NOT NULL,
    "SalePrice" numeric(18,2) NOT NULL,
    "CostPrice" numeric(18,2) NOT NULL,
    "Quantity" integer NOT NULL,
    "ReorderLevel" integer NOT NULL,
    "RentalTotal" integer NOT NULL,
    "RentalInUse" integer NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_inventory_items" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.pos_sales (
    "Id" uuid NOT NULL,
    "Code" character varying(40) NOT NULL,
    "BookingId" uuid,
    "TotalAmount" numeric(18,2) NOT NULL,
    "ItemsJson" jsonb NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_pos_sales" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.promotions (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "MemberGroup" character varying(80) NOT NULL,
    "BenefitType" character varying(30) NOT NULL,
    "BenefitValue" numeric(18,2) NOT NULL,
    "StartsAtUtc" timestamp with time zone NOT NULL,
    "EndsAtUtc" timestamp with time zone NOT NULL,
    "Conditions" character varying(1000) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_promotions" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.shift_handovers (
    "Id" uuid NOT NULL,
    "ShiftId" uuid NOT NULL,
    "HandedOverBy" character varying(160) NOT NULL,
    "ReceivedBy" character varying(160) NOT NULL,
    "OpeningCash" numeric(18,2) NOT NULL,
    "ClosingCash" numeric(18,2) NOT NULL,
    "InventoryChecked" boolean NOT NULL,
    "IncidentNote" character varying(1000),
    "CompletedAtUtc" timestamp with time zone NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_shift_handovers" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.staff_shifts (
    "Id" uuid NOT NULL,
    "StaffName" character varying(160) NOT NULL,
    "StartsAtUtc" timestamp with time zone NOT NULL,
    "EndsAtUtc" timestamp with time zone NOT NULL,
    "Status" character varying(30) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_staff_shifts" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_content_items_Status_PackageId" ON pickletrack.content_items ("Status", "PackageId");

CREATE UNIQUE INDEX "IX_inventory_items_Sku" ON pickletrack.inventory_items ("Sku");

CREATE INDEX "IX_pos_sales_BookingId" ON pickletrack.pos_sales ("BookingId");

CREATE UNIQUE INDEX "IX_pos_sales_Code" ON pickletrack.pos_sales ("Code");

CREATE INDEX "IX_promotions_MemberGroup_StartsAtUtc_EndsAtUtc" ON pickletrack.promotions ("MemberGroup", "StartsAtUtc", "EndsAtUtc");

CREATE INDEX "IX_shift_handovers_ShiftId" ON pickletrack.shift_handovers ("ShiftId");

CREATE INDEX "IX_staff_shifts_StartsAtUtc_EndsAtUtc" ON pickletrack.staff_shifts ("StartsAtUtc", "EndsAtUtc");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260612133543_AddExtendedOwnerOperations', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.content_items ADD "CreatedByName" character varying(160) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.content_items ADD "RejectionReason" character varying(1000);

ALTER TABLE pickletrack.content_items ADD "ReviewedAtUtc" timestamp with time zone;

ALTER TABLE pickletrack.content_items ADD "ReviewedByName" character varying(160);

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260612145609_AddContentReviewAudit', '10.0.4');

COMMIT;

START TRANSACTION;
UPDATE pickletrack.content_items
SET "CreatedByName" = 'Hệ thống'
WHERE "CreatedByName" = '';

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260612150545_BackfillContentCreatorNames', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.coaches ADD "AgreementType" character varying(30) NOT NULL DEFAULT 'hourlyRental';

ALTER TABLE pickletrack.coaches ADD "HourlyCourtRate" numeric(18,2) NOT NULL DEFAULT 150000.0;

ALTER TABLE pickletrack.coaches ADD "PartnershipStartedAtUtc" timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP);

ALTER TABLE pickletrack.coaches ADD "PartnershipStatus" character varying(30) NOT NULL DEFAULT 'active';

ALTER TABLE pickletrack.coaches ADD "RevenueSharePercent" numeric(5,2) NOT NULL DEFAULT 0.0;

CREATE TABLE pickletrack.coach_settlements (
    "Id" uuid NOT NULL,
    "CoachId" uuid NOT NULL,
    "Period" character varying(7) NOT NULL,
    "UsageHours" numeric(10,2) NOT NULL,
    "GrossRevenue" numeric(18,2) NOT NULL,
    "CourtFee" numeric(18,2) NOT NULL,
    "PaidAmount" numeric(18,2) NOT NULL,
    "ReconciliationStatus" character varying(30) NOT NULL,
    "ReconciledAtUtc" timestamp with time zone,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_coach_settlements" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX "IX_coach_settlements_CoachId_Period" ON pickletrack.coach_settlements ("CoachId", "Period");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260612153931_AddCoachPartnershipOperations', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.finance_debts ADD "SourceId" uuid;

ALTER TABLE pickletrack.finance_debts ADD "SourceType" character varying(40);

ALTER TABLE pickletrack.coach_settlements ADD "ConfirmedAtUtc" timestamp with time zone;

ALTER TABLE pickletrack.coach_settlements ADD "ConfirmedBy" character varying(160);

ALTER TABLE pickletrack.coach_settlements ADD "IsConfirmed" boolean NOT NULL DEFAULT FALSE;

CREATE INDEX "IX_finance_debts_SourceType_SourceId" ON pickletrack.finance_debts ("SourceType", "SourceId");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260613012611_SeparateCoachReconciliationDebt', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.payment_renewals ADD "Note" character varying(500);

ALTER TABLE pickletrack.payment_renewals ADD "PaymentMethod" character varying(30) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.payment_renewals ADD "PaymentStatus" character varying(30) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.coaches ADD "AvatarUrl" character varying(500);

ALTER TABLE pickletrack.coaches ADD "Biography" character varying(2000);

ALTER TABLE pickletrack.coaches ADD "Certificates" character varying(1000);

ALTER TABLE pickletrack.coaches ADD "Email" character varying(160);

ALTER TABLE pickletrack.coaches ADD "ExperienceYears" integer NOT NULL DEFAULT 0;

ALTER TABLE pickletrack.coaches ADD "PhoneNumber" character varying(30);

ALTER TABLE pickletrack.coaches ADD "ProfessionalLevel" character varying(120);

ALTER TABLE pickletrack.coaches ADD "TeachingSkills" character varying(500);

ALTER TABLE pickletrack.coaches ADD "WorkingSchedule" character varying(1000);

CREATE TABLE pickletrack.booking_conflict_resolutions (
    "Id" uuid NOT NULL,
    "BookingId" uuid NOT NULL,
    "Action" character varying(30) NOT NULL,
    "Note" character varying(1000) NOT NULL,
    "ResolvedBy" character varying(160) NOT NULL,
    "ResolvedAtUtc" timestamp with time zone NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_booking_conflict_resolutions" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.court_price_rules (
    "Id" uuid NOT NULL,
    "CourtId" uuid NOT NULL,
    "CustomerType" character varying(30) NOT NULL,
    "DayType" character varying(20) NOT NULL,
    "StartTime" time without time zone NOT NULL,
    "EndTime" time without time zone NOT NULL,
    "HourlyRate" numeric(18,2) NOT NULL,
    "EffectiveFrom" date NOT NULL,
    "CreatedBy" character varying(160) NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_court_price_rules" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_booking_conflict_resolutions_BookingId_ResolvedAtUtc" ON pickletrack.booking_conflict_resolutions ("BookingId", "ResolvedAtUtc");

CREATE INDEX "IX_court_price_rules_CourtId_CustomerType_DayType_EffectiveFro~" ON pickletrack.court_price_rules ("CourtId", "CustomerType", "DayType", "EffectiveFrom", "StartTime");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260613020747_AddOwnerOperationsBalance', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.finance_debts ADD "CounterpartyType" character varying(30) NOT NULL DEFAULT 'other';

UPDATE pickletrack.finance_debts
SET "CounterpartyType" = CASE
    WHEN "SourceType" = 'coachSettlement' THEN 'coach'
    WHEN "SourceType" = 'memberRenewal' THEN 'member'
    WHEN "SourceType" = 'courtBooking' THEN 'booking'
    WHEN "Counterparty" ILIKE '%nhà cung cấp%'
      OR "Counterparty" ILIKE '%điện lực%' THEN 'supplier'
    ELSE 'other'
END;

ALTER TABLE pickletrack.court_bookings ADD "PaidAmount" numeric(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE pickletrack.court_bookings ADD "PaymentMethod" character varying(30);

ALTER TABLE pickletrack.court_bookings ADD "ReceiptCode" character varying(40);

CREATE TABLE pickletrack.booking_charges (
    "Id" uuid NOT NULL,
    "BookingId" uuid NOT NULL,
    "ChargeType" character varying(30) NOT NULL,
    "Description" character varying(240) NOT NULL,
    "Quantity" integer NOT NULL,
    "UnitAmount" numeric(18,2) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_booking_charges" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_booking_charges_BookingId_ChargeType" ON pickletrack.booking_charges ("BookingId", "ChargeType");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260613031005_GeneralDebtAndBookingInvoice', '10.0.4');

COMMIT;

START TRANSACTION;
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

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260613031442_BackfillGeneralDebtCategories', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.finance_entries ADD "BranchName" character varying(120) NOT NULL DEFAULT 'Cơ sở chính';

ALTER TABLE pickletrack.finance_entries ADD "ConfirmedAtUtc" timestamp with time zone;

ALTER TABLE pickletrack.finance_entries ADD "ConfirmedBy" character varying(160);

ALTER TABLE pickletrack.finance_entries ADD "CreatedBy" character varying(160) NOT NULL DEFAULT 'Hệ thống';

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260614040349_ExtendSystemFinanceReconciliation', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.pos_sales ADD "CostAmount" numeric(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE pickletrack.pos_sales ADD "PaymentMethod" character varying(30) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.pos_sales ADD "PaymentStatus" character varying(30) NOT NULL DEFAULT '';

CREATE TABLE pickletrack.booking_payments (
    "Id" uuid NOT NULL,
    "BookingId" uuid NOT NULL,
    "ReceiptCode" character varying(40) NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "Method" character varying(30) NOT NULL,
    "PaidAtUtc" timestamp with time zone NOT NULL,
    "CreatedBy" character varying(160) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_booking_payments" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.inventory_movements (
    "Id" uuid NOT NULL,
    "InventoryItemId" uuid NOT NULL,
    "MovementType" character varying(30) NOT NULL,
    "QuantityChange" integer NOT NULL,
    "UnitCost" numeric(18,2) NOT NULL,
    "ReferenceCode" character varying(80) NOT NULL,
    "CreatedBy" character varying(160) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_inventory_movements" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_booking_payments_BookingId_PaidAtUtc" ON pickletrack.booking_payments ("BookingId", "PaidAtUtc");

CREATE UNIQUE INDEX "IX_booking_payments_ReceiptCode" ON pickletrack.booking_payments ("ReceiptCode");

CREATE INDEX "IX_inventory_movements_InventoryItemId_CreatedAtUtc" ON pickletrack.inventory_movements ("InventoryItemId", "CreatedAtUtc");

UPDATE pickletrack.payment_renewals
SET "PaymentMethod" = 'transfer'
WHERE "PaymentMethod" = '';

UPDATE pickletrack.payment_renewals
SET "PaymentStatus" = 'paid'
WHERE "PaymentStatus" = '';

UPDATE pickletrack.pos_sales
SET "PaymentMethod" = CASE WHEN "BookingId" IS NULL THEN 'cash' ELSE 'invoice' END,
    "PaymentStatus" = CASE WHEN "BookingId" IS NULL THEN 'paid' ELSE 'invoiced' END;

UPDATE pickletrack.pos_sales sale
SET "CostAmount" = costs.total_cost
FROM (
    SELECT sale_row."Id",
           COALESCE(SUM((line->>'Quantity')::integer * item."CostPrice"), 0) AS total_cost
    FROM pickletrack.pos_sales sale_row
    CROSS JOIN LATERAL jsonb_array_elements(sale_row."ItemsJson") line
    JOIN pickletrack.inventory_items item
      ON item."Id" = (line->>'ItemId')::uuid
    GROUP BY sale_row."Id"
) costs
WHERE costs."Id" = sale."Id";

INSERT INTO pickletrack.finance_entries (
    "Id", "Code", "Type", "Category", "Counterparty",
    "Amount", "ActualAmount", "Method", "OccurredAtUtc",
    "ReferenceCode", "Note", "ReconciliationStatus",
    "CreatedAtUtc", "UpdatedAtUtc", "BranchName", "CreatedBy")
SELECT renewal."Id",
       'PT-LEG-' || UPPER(SUBSTRING(REPLACE(renewal."Id"::text, '-', '') FROM 1 FOR 8)),
       'income', 'membership', member."FullName",
       renewal."Amount", renewal."Amount", renewal."PaymentMethod",
       renewal."CreatedAtUtc",
       'RENEWAL:' || REPLACE(renewal."Id"::text, '-', ''),
       COALESCE(renewal."Note", 'Backfill thanh toán gia hạn legacy'),
       'reconciled', renewal."CreatedAtUtc", renewal."UpdatedAtUtc",
       'Cơ sở chính', 'Migration legacy'
FROM pickletrack.payment_renewals renewal
JOIN pickletrack.members member ON member."Id" = renewal."MemberId"
WHERE renewal."PaymentStatus" = 'paid'
  AND NOT EXISTS (
      SELECT 1 FROM pickletrack.finance_entries entry
      WHERE entry."ReferenceCode" =
            'RENEWAL:' || REPLACE(renewal."Id"::text, '-', '')
  );

INSERT INTO pickletrack.booking_payments (
    "Id", "BookingId", "ReceiptCode", "Amount", "Method",
    "PaidAtUtc", "CreatedBy", "CreatedAtUtc", "UpdatedAtUtc")
SELECT entry."Id",
       REPLACE(SUBSTRING(entry."ReferenceCode" FROM 9), '-', '')::uuid,
       entry."Code",
       entry."Amount",
       entry."Method",
       entry."OccurredAtUtc",
       entry."CreatedBy",
       entry."CreatedAtUtc",
       entry."UpdatedAtUtc"
FROM pickletrack.finance_entries entry
WHERE entry."Type" = 'income'
  AND entry."ReferenceCode" LIKE 'BOOKING:%'
  AND NOT EXISTS (
      SELECT 1 FROM pickletrack.booking_payments payment
      WHERE payment."ReceiptCode" = entry."Code"
  );

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260614055838_NormalizeFinancialReportingSources', '10.0.4');

COMMIT;

START TRANSACTION;
CREATE TABLE pickletrack.court_schedule_entries (
    "Id" uuid NOT NULL,
    "CourtId" uuid NOT NULL,
    "ScheduleType" character varying(30) NOT NULL,
    "OwnerName" character varying(160) NOT NULL,
    "Purpose" character varying(240) NOT NULL,
    "StartsAtUtc" timestamp with time zone NOT NULL,
    "EndsAtUtc" timestamp with time zone NOT NULL,
    "Status" character varying(30) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_court_schedule_entries" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_court_schedule_entries_courts_CourtId" FOREIGN KEY ("CourtId") REFERENCES pickletrack.courts ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_court_schedule_entries_CourtId_StartsAtUtc" ON pickletrack.court_schedule_entries ("CourtId", "StartsAtUtc");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260614122319_AddCourtScheduleEntries', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.classes ADD "CourtId" uuid;

UPDATE pickletrack.classes AS class
SET "CourtId" = court."Id"
FROM pickletrack.courts AS court
WHERE class."CourtId" IS NULL
  AND class."CourtName" IS NOT NULL
  AND LOWER(class."CourtName") = LOWER(court."Name");

CREATE INDEX "IX_classes_CourtId" ON pickletrack.classes ("CourtId");

ALTER TABLE pickletrack.classes ADD CONSTRAINT "FK_classes_courts_CourtId" FOREIGN KEY ("CourtId") REFERENCES pickletrack.courts ("Id") ON DELETE RESTRICT;

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260614123000_LinkClassesToCourts', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.pos_sales ADD "IdempotencyKey" character varying(80) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.court_bookings ADD "BookingCode" character varying(24) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.court_bookings ADD "CustomerType" character varying(20) NOT NULL DEFAULT 'guest';

ALTER TABLE pickletrack.booking_payments ADD "Note" character varying(500);

ALTER TABLE pickletrack.booking_payments ADD "TransactionType" character varying(20) NOT NULL DEFAULT 'payment';

UPDATE pickletrack.court_bookings
SET "BookingCode" = 'BK-' || UPPER(SUBSTRING(REPLACE("Id"::text, '-', '') FROM 1 FOR 8))
WHERE "BookingCode" = '';

UPDATE pickletrack.pos_sales
SET "IdempotencyKey" = 'LEGACY:' || REPLACE("Id"::text, '-', '')
WHERE "IdempotencyKey" = '';

CREATE UNIQUE INDEX "IX_pos_sales_IdempotencyKey" ON pickletrack.pos_sales ("IdempotencyKey");

CREATE UNIQUE INDEX "IX_inventory_movements_InventoryItemId_ReferenceCode_MovementT~" ON pickletrack.inventory_movements ("InventoryItemId", "ReferenceCode", "MovementType");

CREATE UNIQUE INDEX "IX_court_bookings_BookingCode" ON pickletrack.court_bookings ("BookingCode");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260614145949_UnifyBookingLifecycle', '10.0.4');

COMMIT;

START TRANSACTION;
UPDATE pickletrack.inventory_movements movement
SET "MovementType" = 'rentalCheckout'
FROM pickletrack.inventory_items item
WHERE item."Id" = movement."InventoryItemId"
  AND item."Category" = 'rental'
  AND movement."MovementType" = 'sale';

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260614151957_NormalizeRentalInventoryMovements', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.finance_debts ADD "IsCancelled" boolean NOT NULL DEFAULT FALSE;

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260614153726_CompleteAdminLifecycle', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.payment_renewals ADD "ActivatedAtUtc" timestamp with time zone NOT NULL DEFAULT TIMESTAMPTZ '-infinity';

ALTER TABLE pickletrack.payment_renewals ADD "ExpiresAtUtc" timestamp with time zone NOT NULL DEFAULT TIMESTAMPTZ '-infinity';

ALTER TABLE pickletrack.payment_renewals ADD "FreeCourtUsesGranted" integer NOT NULL DEFAULT 0;

ALTER TABLE pickletrack.payment_renewals ADD "FreeCourtUsesUsed" integer NOT NULL DEFAULT 0;

ALTER TABLE pickletrack.packages ADD "FreeCourtMinutesPerUse" integer NOT NULL DEFAULT 0;

ALTER TABLE pickletrack.packages ADD "FreeCourtUses" integer NOT NULL DEFAULT 0;

ALTER TABLE pickletrack.packages ADD "ValidityDays" integer NOT NULL DEFAULT 30;

ALTER TABLE pickletrack.court_bookings ADD "AppliedMembershipRenewalId" uuid;

ALTER TABLE pickletrack.court_bookings ADD "CourtAmountBeforeBenefit" numeric(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE pickletrack.court_bookings ADD "CourtBenefitDiscount" numeric(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE pickletrack.court_bookings ADD "MemberId" uuid;

ALTER TABLE pickletrack.court_bookings ADD "MembershipBenefitExpiresAtUtc" timestamp with time zone;

ALTER TABLE pickletrack.court_bookings ADD "MembershipBenefitNote" character varying(300);

ALTER TABLE pickletrack.court_bookings ADD "MembershipBenefitUsesRemainingAfterApply" integer;

ALTER TABLE pickletrack.court_bookings ADD "MembershipPackageName" character varying(160);

UPDATE pickletrack.court_bookings
SET "CourtAmountBeforeBenefit" = "Amount";

UPDATE pickletrack.payment_renewals
SET "ActivatedAtUtc" = "CreatedAtUtc",
    "ExpiresAtUtc" = "CreatedAtUtc" + INTERVAL '30 days';

CREATE INDEX "IX_payment_renewals_MemberId_ExpiresAtUtc" ON pickletrack.payment_renewals ("MemberId", "ExpiresAtUtc");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260615012055_AddMembershipCourtBenefits', '10.0.4');

COMMIT;

START TRANSACTION;
ALTER TABLE pickletrack.courts ADD "Capacity" integer NOT NULL DEFAULT 4;

ALTER TABLE pickletrack.courts ADD "ClosesAt" time without time zone NOT NULL DEFAULT TIME '23:00:00';

ALTER TABLE pickletrack.courts ADD "CourtType" character varying(60) NOT NULL DEFAULT 'standard';

ALTER TABLE pickletrack.courts ADD "Description" character varying(500) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.courts ADD "OpensAt" time without time zone NOT NULL DEFAULT TIME '05:00:00';

ALTER TABLE pickletrack.courts ADD "OperationalStatus" character varying(30) NOT NULL DEFAULT 'available';

CREATE INDEX "IX_courts_OperationalStatus" ON pickletrack.courts ("OperationalStatus");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260616010458_AddCourtManagement', '10.0.4');

COMMIT;

START TRANSACTION;
DROP INDEX pickletrack."IX_court_price_rules_CourtId_CustomerType_DayType_EffectiveFro~";

ALTER TABLE pickletrack.court_price_rules ADD "HolidayDates" character varying(2000) NOT NULL DEFAULT '';

ALTER TABLE pickletrack.court_price_rules ADD "PriceType" character varying(20) NOT NULL DEFAULT 'regular';

UPDATE pickletrack.court_price_rules
SET "PriceType" = 'peak'
WHERE "CustomerType" = 'guest'
  AND "DayType" = 'weekday'
  AND "StartTime" >= TIME '17:00';

CREATE INDEX "IX_court_price_rules_CourtId_PriceType_CustomerType_DayType_Ef~" ON pickletrack.court_price_rules ("CourtId", "PriceType", "CustomerType", "DayType", "EffectiveFrom", "StartTime");

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260616084203_AddCourtPriceRuleTypes', '10.0.4');

COMMIT;

START TRANSACTION;
CREATE TABLE pickletrack.class_enrollments (
    "Id" uuid NOT NULL,
    "ClassId" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "PackageId" uuid,
    "Status" character varying(30) NOT NULL,
    "EnrolledAtUtc" timestamp with time zone NOT NULL,
    "LeftAtUtc" timestamp with time zone,
    "Note" character varying(500),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_class_enrollments" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_class_enrollments_classes_ClassId" FOREIGN KEY ("ClassId") REFERENCES pickletrack.classes ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_class_enrollments_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_class_enrollments_packages_PackageId" FOREIGN KEY ("PackageId") REFERENCES pickletrack.packages ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.court_occupancies (
    "Id" uuid NOT NULL,
    "CourtId" uuid NOT NULL,
    "SourceType" character varying(40) NOT NULL,
    "SourceId" uuid NOT NULL,
    "StartsAtUtc" timestamp with time zone NOT NULL,
    "EndsAtUtc" timestamp with time zone NOT NULL,
    "Title" character varying(160) NOT NULL,
    "OwnerName" character varying(160) NOT NULL,
    "Status" character varying(30) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_court_occupancies" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_court_occupancies_courts_CourtId" FOREIGN KEY ("CourtId") REFERENCES pickletrack.courts ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.equipment_rental_orders (
    "Id" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "CourtBookingId" uuid,
    "RentalDate" date NOT NULL,
    "Status" character varying(30) NOT NULL,
    "Note" character varying(1000),
    "ReceivedAtUtc" timestamp with time zone,
    "ReturnedAtUtc" timestamp with time zone,
    "ClosedAtUtc" timestamp with time zone,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_equipment_rental_orders" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_equipment_rental_orders_court_bookings_CourtBookingId" FOREIGN KEY ("CourtBookingId") REFERENCES pickletrack.court_bookings ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_equipment_rental_orders_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.invoices (
    "Id" uuid NOT NULL,
    "InvoiceCode" character varying(40) NOT NULL,
    "InvoiceType" character varying(40) NOT NULL,
    "CustomerType" character varying(40) NOT NULL,
    "CustomerName" character varying(160) NOT NULL,
    "MemberId" uuid,
    "SourceType" character varying(40),
    "SourceId" uuid,
    "IssuedAtUtc" timestamp with time zone NOT NULL,
    "GrossAmount" numeric(18,2) NOT NULL,
    "DiscountAmount" numeric(18,2) NOT NULL,
    "PaidAmount" numeric(18,2) NOT NULL,
    "Status" character varying(30) NOT NULL,
    "Note" character varying(1000),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_invoices" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_invoices_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.membership_plans (
    "Id" uuid NOT NULL,
    "Code" character varying(40) NOT NULL,
    "Name" character varying(160) NOT NULL,
    "DurationMonths" integer NOT NULL,
    "Price" numeric(18,2) NOT NULL,
    "CanRegisterStudent" boolean NOT NULL,
    "HasPriorityCourtWindow" boolean NOT NULL,
    "DisplayOrder" integer NOT NULL,
    "Notes" character varying(1000),
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_membership_plans" PRIMARY KEY ("Id")
);

CREATE TABLE pickletrack.payments (
    "Id" uuid NOT NULL,
    "PaymentCode" character varying(40) NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "Method" character varying(30) NOT NULL,
    "Status" character varying(30) NOT NULL,
    "PaidAtUtc" timestamp with time zone NOT NULL,
    "CreatedByUserId" uuid NOT NULL,
    "ExternalReference" character varying(120),
    "Note" character varying(1000),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_payments" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_payments_users_CreatedByUserId" FOREIGN KEY ("CreatedByUserId") REFERENCES pickletrack.users ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.pos_sale_lines (
    "Id" uuid NOT NULL,
    "PosSaleId" uuid NOT NULL,
    "InventoryItemId" uuid NOT NULL,
    "ItemNameSnapshot" character varying(160) NOT NULL,
    "Quantity" integer NOT NULL,
    "UnitPrice" numeric(18,2) NOT NULL,
    "UnitCost" numeric(18,2) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_pos_sale_lines" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_pos_sale_lines_inventory_items_InventoryItemId" FOREIGN KEY ("InventoryItemId") REFERENCES pickletrack.inventory_items ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_pos_sale_lines_pos_sales_PosSaleId" FOREIGN KEY ("PosSaleId") REFERENCES pickletrack.pos_sales ("Id") ON DELETE CASCADE
);

CREATE TABLE pickletrack.package_ledger_entries (
    "Id" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "ClassEnrollmentId" uuid,
    "SourceType" character varying(40) NOT NULL,
    "SourceId" uuid NOT NULL,
    "SessionDelta" integer NOT NULL,
    "BalanceAfter" integer,
    "OccurredAtUtc" timestamp with time zone NOT NULL,
    "Note" character varying(500),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_package_ledger_entries" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_package_ledger_entries_class_enrollments_ClassEnrollmentId" FOREIGN KEY ("ClassEnrollmentId") REFERENCES pickletrack.class_enrollments ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_package_ledger_entries_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.equipment_rental_order_items (
    "Id" uuid NOT NULL,
    "EquipmentRentalOrderId" uuid NOT NULL,
    "InventoryItemId" uuid NOT NULL,
    "RequestedQuantity" integer NOT NULL,
    "ReceivedQuantity" integer NOT NULL,
    "ReturnedQuantity" integer NOT NULL,
    "LostQuantity" integer NOT NULL,
    "Status" character varying(30) NOT NULL,
    "SurchargeAmount" numeric(18,2) NOT NULL,
    "Note" character varying(1000),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_equipment_rental_order_items" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_equipment_rental_order_items_equipment_rental_orders_Equipm~" FOREIGN KEY ("EquipmentRentalOrderId") REFERENCES pickletrack.equipment_rental_orders ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_equipment_rental_order_items_inventory_items_InventoryItemId" FOREIGN KEY ("InventoryItemId") REFERENCES pickletrack.inventory_items ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.invoice_lines (
    "Id" uuid NOT NULL,
    "InvoiceId" uuid NOT NULL,
    "LineType" character varying(40) NOT NULL,
    "Description" character varying(240) NOT NULL,
    "Quantity" integer NOT NULL,
    "UnitAmount" numeric(18,2) NOT NULL,
    "SourceType" character varying(40),
    "SourceId" uuid,
    "InventoryItemId" uuid,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_invoice_lines" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_invoice_lines_inventory_items_InventoryItemId" FOREIGN KEY ("InventoryItemId") REFERENCES pickletrack.inventory_items ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_invoice_lines_invoices_InvoiceId" FOREIGN KEY ("InvoiceId") REFERENCES pickletrack.invoices ("Id") ON DELETE CASCADE
);

CREATE TABLE pickletrack.refunds (
    "Id" uuid NOT NULL,
    "RefundCode" character varying(40) NOT NULL,
    "InvoiceId" uuid NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "Reason" character varying(1000) NOT NULL,
    "CreatedByUserId" uuid NOT NULL,
    "RefundedAtUtc" timestamp with time zone NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_refunds" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_refunds_invoices_InvoiceId" FOREIGN KEY ("InvoiceId") REFERENCES pickletrack.invoices ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_refunds_users_CreatedByUserId" FOREIGN KEY ("CreatedByUserId") REFERENCES pickletrack.users ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.membership_plan_benefits (
    "Id" uuid NOT NULL,
    "MembershipPlanId" uuid NOT NULL,
    "BenefitCode" character varying(60) NOT NULL,
    "Label" character varying(160) NOT NULL,
    "ValueText" character varying(500) NOT NULL,
    "DisplayOrder" integer NOT NULL,
    "IsHighlighted" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_membership_plan_benefits" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_membership_plan_benefits_membership_plans_MembershipPlanId" FOREIGN KEY ("MembershipPlanId") REFERENCES pickletrack.membership_plans ("Id") ON DELETE CASCADE
);

CREATE TABLE pickletrack.membership_requests (
    "Id" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "MembershipPlanId" uuid NOT NULL,
    "RequestType" character varying(30) NOT NULL,
    "RequestedStartDate" date NOT NULL,
    "Status" character varying(30) NOT NULL,
    "Note" character varying(500),
    "ReviewedByUserId" uuid,
    "ReviewedAtUtc" timestamp with time zone,
    "ReviewNote" character varying(1000),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_membership_requests" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_membership_requests_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_membership_requests_membership_plans_MembershipPlanId" FOREIGN KEY ("MembershipPlanId") REFERENCES pickletrack.membership_plans ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_membership_requests_users_ReviewedByUserId" FOREIGN KEY ("ReviewedByUserId") REFERENCES pickletrack.users ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.payment_allocations (
    "Id" uuid NOT NULL,
    "PaymentId" uuid NOT NULL,
    "InvoiceId" uuid NOT NULL,
    "Amount" numeric(18,2) NOT NULL,
    "Note" character varying(500),
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_payment_allocations" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_payment_allocations_invoices_InvoiceId" FOREIGN KEY ("InvoiceId") REFERENCES pickletrack.invoices ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_payment_allocations_payments_PaymentId" FOREIGN KEY ("PaymentId") REFERENCES pickletrack.payments ("Id") ON DELETE RESTRICT
);

CREATE TABLE pickletrack.membership_subscriptions (
    "Id" uuid NOT NULL,
    "MemberId" uuid NOT NULL,
    "MembershipPlanId" uuid NOT NULL,
    "MembershipRequestId" uuid,
    "StartDate" date NOT NULL,
    "EndDate" date NOT NULL,
    "Status" character varying(30) NOT NULL,
    "IsCurrent" boolean NOT NULL,
    "ActivatedByUserId" uuid,
    "ActivatedAtUtc" timestamp with time zone,
    "CancelledAtUtc" timestamp with time zone,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_membership_subscriptions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_membership_subscriptions_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_membership_subscriptions_membership_plans_MembershipPlanId" FOREIGN KEY ("MembershipPlanId") REFERENCES pickletrack.membership_plans ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_membership_subscriptions_membership_requests_MembershipRequ~" FOREIGN KEY ("MembershipRequestId") REFERENCES pickletrack.membership_requests ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_membership_subscriptions_users_ActivatedByUserId" FOREIGN KEY ("ActivatedByUserId") REFERENCES pickletrack.users ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_renewal_requests_PackageId" ON pickletrack.renewal_requests ("PackageId");

CREATE INDEX "IX_payment_renewals_PackageId" ON pickletrack.payment_renewals ("PackageId");

CREATE INDEX "IX_court_bookings_AppliedMembershipRenewalId" ON pickletrack.court_bookings ("AppliedMembershipRenewalId");

CREATE INDEX "IX_court_bookings_MemberId" ON pickletrack.court_bookings ("MemberId");

CREATE INDEX "IX_attendance_records_MemberId" ON pickletrack.attendance_records ("MemberId");

CREATE UNIQUE INDEX "IX_class_enrollments_ClassId_MemberId" ON pickletrack.class_enrollments ("ClassId", "MemberId");

CREATE INDEX "IX_class_enrollments_MemberId_Status" ON pickletrack.class_enrollments ("MemberId", "Status");

CREATE INDEX "IX_class_enrollments_PackageId" ON pickletrack.class_enrollments ("PackageId");

CREATE INDEX "IX_court_occupancies_CourtId_StartsAtUtc" ON pickletrack.court_occupancies ("CourtId", "StartsAtUtc");

CREATE UNIQUE INDEX "IX_court_occupancies_SourceType_SourceId" ON pickletrack.court_occupancies ("SourceType", "SourceId");

CREATE INDEX "IX_equipment_rental_order_items_EquipmentRentalOrderId_Invento~" ON pickletrack.equipment_rental_order_items ("EquipmentRentalOrderId", "InventoryItemId");

CREATE INDEX "IX_equipment_rental_order_items_InventoryItemId" ON pickletrack.equipment_rental_order_items ("InventoryItemId");

CREATE INDEX "IX_equipment_rental_orders_CourtBookingId" ON pickletrack.equipment_rental_orders ("CourtBookingId");

CREATE INDEX "IX_equipment_rental_orders_MemberId_RentalDate" ON pickletrack.equipment_rental_orders ("MemberId", "RentalDate");

CREATE INDEX "IX_invoice_lines_InventoryItemId" ON pickletrack.invoice_lines ("InventoryItemId");

CREATE INDEX "IX_invoice_lines_InvoiceId_LineType" ON pickletrack.invoice_lines ("InvoiceId", "LineType");

CREATE UNIQUE INDEX "IX_invoices_InvoiceCode" ON pickletrack.invoices ("InvoiceCode");

CREATE INDEX "IX_invoices_MemberId_IssuedAtUtc" ON pickletrack.invoices ("MemberId", "IssuedAtUtc");

CREATE INDEX "IX_invoices_SourceType_SourceId" ON pickletrack.invoices ("SourceType", "SourceId");

CREATE INDEX "IX_membership_plan_benefits_MembershipPlanId_BenefitCode" ON pickletrack.membership_plan_benefits ("MembershipPlanId", "BenefitCode");

CREATE UNIQUE INDEX "IX_membership_plans_Code" ON pickletrack.membership_plans ("Code");

CREATE INDEX "IX_membership_plans_IsActive_DisplayOrder" ON pickletrack.membership_plans ("IsActive", "DisplayOrder");

CREATE INDEX "IX_membership_requests_MemberId_Status" ON pickletrack.membership_requests ("MemberId", "Status");

CREATE INDEX "IX_membership_requests_MembershipPlanId" ON pickletrack.membership_requests ("MembershipPlanId");

CREATE INDEX "IX_membership_requests_ReviewedByUserId" ON pickletrack.membership_requests ("ReviewedByUserId");

CREATE INDEX "IX_membership_subscriptions_ActivatedByUserId" ON pickletrack.membership_subscriptions ("ActivatedByUserId");

CREATE INDEX "IX_membership_subscriptions_MemberId_IsCurrent" ON pickletrack.membership_subscriptions ("MemberId", "IsCurrent");

CREATE INDEX "IX_membership_subscriptions_MembershipPlanId_Status" ON pickletrack.membership_subscriptions ("MembershipPlanId", "Status");

CREATE INDEX "IX_membership_subscriptions_MembershipRequestId" ON pickletrack.membership_subscriptions ("MembershipRequestId");

CREATE INDEX "IX_package_ledger_entries_ClassEnrollmentId" ON pickletrack.package_ledger_entries ("ClassEnrollmentId");

CREATE INDEX "IX_package_ledger_entries_MemberId_OccurredAtUtc" ON pickletrack.package_ledger_entries ("MemberId", "OccurredAtUtc");

CREATE UNIQUE INDEX "IX_package_ledger_entries_SourceType_SourceId" ON pickletrack.package_ledger_entries ("SourceType", "SourceId");

CREATE INDEX "IX_payment_allocations_InvoiceId" ON pickletrack.payment_allocations ("InvoiceId");

CREATE UNIQUE INDEX "IX_payment_allocations_PaymentId_InvoiceId" ON pickletrack.payment_allocations ("PaymentId", "InvoiceId");

CREATE INDEX "IX_payments_CreatedByUserId" ON pickletrack.payments ("CreatedByUserId");

CREATE INDEX "IX_payments_PaidAtUtc_Status" ON pickletrack.payments ("PaidAtUtc", "Status");

CREATE UNIQUE INDEX "IX_payments_PaymentCode" ON pickletrack.payments ("PaymentCode");

CREATE INDEX "IX_pos_sale_lines_InventoryItemId" ON pickletrack.pos_sale_lines ("InventoryItemId");

CREATE INDEX "IX_pos_sale_lines_PosSaleId_InventoryItemId" ON pickletrack.pos_sale_lines ("PosSaleId", "InventoryItemId");

CREATE INDEX "IX_refunds_CreatedByUserId" ON pickletrack.refunds ("CreatedByUserId");

CREATE INDEX "IX_refunds_InvoiceId_RefundedAtUtc" ON pickletrack.refunds ("InvoiceId", "RefundedAtUtc");

CREATE UNIQUE INDEX "IX_refunds_RefundCode" ON pickletrack.refunds ("RefundCode");

ALTER TABLE pickletrack.attendance_records ADD CONSTRAINT "FK_attendance_records_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.attendance_records ADD CONSTRAINT "FK_attendance_records_sessions_SessionId" FOREIGN KEY ("SessionId") REFERENCES pickletrack.sessions ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.booking_charges ADD CONSTRAINT "FK_booking_charges_court_bookings_BookingId" FOREIGN KEY ("BookingId") REFERENCES pickletrack.court_bookings ("Id") ON DELETE CASCADE;

ALTER TABLE pickletrack.booking_payments ADD CONSTRAINT "FK_booking_payments_court_bookings_BookingId" FOREIGN KEY ("BookingId") REFERENCES pickletrack.court_bookings ("Id") ON DELETE CASCADE;

ALTER TABLE pickletrack.classes ADD CONSTRAINT "FK_classes_coaches_CoachId" FOREIGN KEY ("CoachId") REFERENCES pickletrack.coaches ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.coach_settlements ADD CONSTRAINT "FK_coach_settlements_coaches_CoachId" FOREIGN KEY ("CoachId") REFERENCES pickletrack.coaches ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.coaches ADD CONSTRAINT "FK_coaches_users_UserId" FOREIGN KEY ("UserId") REFERENCES pickletrack.users ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.court_bookings ADD CONSTRAINT "FK_court_bookings_courts_CourtId" FOREIGN KEY ("CourtId") REFERENCES pickletrack.courts ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.court_bookings ADD CONSTRAINT "FK_court_bookings_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.court_bookings ADD CONSTRAINT "FK_court_bookings_payment_renewals_AppliedMembershipRenewalId" FOREIGN KEY ("AppliedMembershipRenewalId") REFERENCES pickletrack.payment_renewals ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.inventory_movements ADD CONSTRAINT "FK_inventory_movements_inventory_items_InventoryItemId" FOREIGN KEY ("InventoryItemId") REFERENCES pickletrack.inventory_items ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.members ADD CONSTRAINT "FK_members_users_UserId" FOREIGN KEY ("UserId") REFERENCES pickletrack.users ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.payment_renewals ADD CONSTRAINT "FK_payment_renewals_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.payment_renewals ADD CONSTRAINT "FK_payment_renewals_packages_PackageId" FOREIGN KEY ("PackageId") REFERENCES pickletrack.packages ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.pos_sales ADD CONSTRAINT "FK_pos_sales_court_bookings_BookingId" FOREIGN KEY ("BookingId") REFERENCES pickletrack.court_bookings ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.renewal_requests ADD CONSTRAINT "FK_renewal_requests_members_MemberId" FOREIGN KEY ("MemberId") REFERENCES pickletrack.members ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.renewal_requests ADD CONSTRAINT "FK_renewal_requests_packages_PackageId" FOREIGN KEY ("PackageId") REFERENCES pickletrack.packages ("Id") ON DELETE RESTRICT;

ALTER TABLE pickletrack.sessions ADD CONSTRAINT "FK_sessions_classes_ClassId" FOREIGN KEY ("ClassId") REFERENCES pickletrack.classes ("Id") ON DELETE RESTRICT;

INSERT INTO pickletrack.__ef_migrations_history ("MigrationId", "ProductVersion")
VALUES ('20260625061357_AddUnifiedCodeFirstModel', '10.0.4');

COMMIT;

