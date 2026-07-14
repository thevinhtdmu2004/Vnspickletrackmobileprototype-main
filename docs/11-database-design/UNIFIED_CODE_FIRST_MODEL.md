# Unified Code First Database Model

Date: 2026-06-25

## Scope

This document records the approved Code First consolidation after comparing the
current project database model with:

- `HLV.docx`
- `hocvien.sql`
- `HoiVien_Database.docx`

No SQL script is imported directly. No pgAdmin-created table is accepted as the
source of truth. Entity Framework Core entities remain the migration source.
This pass adds domain/entity metadata only; no migration has been generated.

## Existing Entities Kept

These entities remain canonical and were not duplicated:

| Capability | Existing entity |
|---|---|
| Login and roles | `User` |
| Facility member/customer profile | `Member` |
| Coach partnership/profile | `Coach` |
| Training class | `TrainingClass` |
| Class session | `ClassSession` |
| Attendance | `AttendanceRecord` |
| Training package compatibility | `Package` |
| Training renewal request compatibility | `RenewalRequest` |
| Training renewal payment compatibility | `PaymentRenewal` |
| Court | `Court` |
| Court booking | `CourtBooking` |
| Legacy schedule projection | `CourtScheduleEntry` |
| Court pricing | `CourtPriceRule` |
| Booking charge and direct booking payment | `BookingCharge`, `BookingPayment` |
| Finance compatibility ledger | `FinanceEntry`, `FinanceDebt` |
| Coach settlement | `CoachSettlement` |
| Inventory and stock movement | `InventoryItem`, `InventoryMovement` |
| POS sale compatibility header | `PosSale` |
| Content and promotion | `ContentItem`, `Promotion` |
| Staff shift and handover | `StaffShift`, `ShiftHandover` |

## Added Entities

| Entity | Purpose | Source mapping |
|---|---|---|
| `ClassEnrollment` | A Member becomes a student by enrolling in a Coach-owned class. | `ClassMembers`, `tai_khoan_khoa_hoc` |
| `PackageLedgerEntry` | Auditable training session balance movements. | replaces balance counters in `ClassMembers` and `lich_su_mua_goi_hoi_vien` |
| `MembershipPlan` | Facility membership plan, separate from training package. | `membership_plans`, membership meaning of `goi_hoi_vien` |
| `MembershipPlanBenefit` | Facility membership benefits such as priority window or discount. | `membership_plan_benefits` |
| `MembershipRequest` | Register/renew/upgrade/downgrade membership request. | `member_membership_requests` |
| `MembershipSubscription` | Active/expired/cancelled facility membership period. | `member_membership_subscriptions` |
| `CourtOccupancy` | Unified court occupation for booking, class session, Coach use, event, maintenance and manual block. | `court_booking_slots`, class/session court use |
| `Invoice` | Common financial source document. | `hoa_don`, `member_membership_payments`, booking invoice concept |
| `InvoiceLine` | Common document line for court fee, POS, rental, surcharge, discount or package item. | `lich_su_mua_*`, booking charges |
| `Payment` | Common posted money movement. | `member_membership_payments`, `BookingPayment`, `PaymentRenewal` |
| `PaymentAllocation` | Allocation from payment to invoice. | financial reconciliation requirement |
| `Refund` | Refund event linked back to invoice. | booking cancellation/refund rules |
| `PosSaleLine` | Normalized POS item lines linked to inventory. | `lich_su_mua_san_pham`, `PosSale.ItemsJson` future replacement |
| `EquipmentRentalOrder` | Rental order tied to member and optionally booking. | `equipment_rental_orders` |
| `EquipmentRentalOrderItem` | Rental order item with received/returned/lost quantities and surcharge. | `equipment_rental_order_items` |

## Merged Or Renamed Source Tables

| Source table | Target entity |
|---|---|
| `tai_khoan` | `User` plus `Member` or `Coach` profile |
| `khoa_hoc` | `TrainingClass` |
| `lich_hoc` | `ClassSession`; create `CourtOccupancy` when a court is used |
| `tai_khoan_khoa_hoc` | `ClassEnrollment` |
| `lich_su_hoc` | `AttendanceRecord` |
| `goi_hoi_vien` | `Package` for training or `MembershipPlan` for facility membership, depending business meaning |
| `hoa_don` | `Invoice` |
| `lich_su_mua_san_pham` | `InvoiceLine` and/or `PosSaleLine` |
| `lich_su_mua_khoa_hoc` | `InvoiceLine` linked to package/class source |
| `lich_su_mua_goi_hoi_vien` | `MembershipSubscription` plus `PackageLedgerEntry` when it grants training sessions |
| `san_pham`, `equipment_catalog` | `InventoryItem` |
| `court_booking_slots` | `CourtOccupancy` |

## Ignored Direct Imports

The following are not imported as-is:

- Vietnamese SQL table names from `hocvien.sql`.
- Any `SERIAL` integer identity table from the SQL file.
- Separate role-specific payment tables.
- Shopping cart table `gio_hang` as a core database table.
- Trigger-based `updated_at` rules; EF/domain update methods remain the source.

## Canonical Relationships

```text
User 1 - 0..1 Member
User 1 - 0..1 Coach

Coach 1 - N TrainingClass
TrainingClass 1 - N ClassSession
TrainingClass N - N Member through ClassEnrollment

ClassSession 1 - N AttendanceRecord
Member 1 - N AttendanceRecord
AttendanceRecord 0..1 - 1 PackageLedgerEntry when the status deducts a session

Court 1 - N CourtBooking
Court 1 - N CourtOccupancy
CourtBooking 1 - 1 CourtOccupancy
ClassSession 0..1 - 1 CourtOccupancy when a court is used

CourtBooking 1 - N BookingCharge
CourtBooking 1 - N BookingPayment compatibility records
CourtBooking 1 - N PosSale and EquipmentRentalOrder

Invoice 1 - N InvoiceLine
Payment 1 - N PaymentAllocation
Invoice 1 - N PaymentAllocation
Invoice 1 - N Refund

InventoryItem 1 - N InventoryMovement
PosSale 1 - N PosSaleLine
EquipmentRentalOrder 1 - N EquipmentRentalOrderItem
```

Reports are read models. They should query canonical source entities and should
not own duplicate report tables unless a future projection/cache is explicitly
approved.

## Business Rules Preserved

- `User` is the shared login account for every actor.
- `Member` is the base profile for customers and facility members.
- Student is not a separate person table; a student is a `Member` with active or
historical `ClassEnrollment`/training entitlement.
- `Coach` links to `User`.
- `TrainingClass` links to `Coach`.
- Court-using class sessions must create or link `CourtOccupancy`.
- Court bookings and all active occupancies must reject overlapping court/time.
- Invoice, payment, debt, reconciliation and reports must trace back to source
documents.
- POS sale and rental usage must link to inventory and invoice lines.
- Coach and Member must not access owner revenue.
- Owner/Admin does not directly manage Coach internal student/class detail beyond
approved operational and financial visibility.

## Migration Guidance

Do not create one large migration until the team approves:

1. Whether `PaymentRenewal`, `BookingPayment` and `FinanceEntry` remain
   compatibility tables or become adapters to `Invoice`/`Payment`.
2. Whether `CourtScheduleEntry` is retained as a read projection or replaced by
   `CourtOccupancy`.
3. Whether `Package` remains training-only or receives an explicit package kind.
4. The backfill rules from existing seed data into new entities.

After approval, create the EF migration from code first and validate build,
domain tests, API contract tests and deterministic finance/court-overlap
fixtures.
