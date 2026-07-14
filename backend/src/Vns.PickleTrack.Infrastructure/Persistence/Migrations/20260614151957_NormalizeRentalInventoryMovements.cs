using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vns.PickleTrack.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeRentalInventoryMovements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE pickletrack.inventory_movements movement
                SET "MovementType" = 'rentalCheckout'
                FROM pickletrack.inventory_items item
                WHERE item."Id" = movement."InventoryItemId"
                  AND item."Category" = 'rental'
                  AND movement."MovementType" = 'sale';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE pickletrack.inventory_movements movement
                SET "MovementType" = 'sale'
                FROM pickletrack.inventory_items item
                WHERE item."Id" = movement."InventoryItemId"
                  AND item."Category" = 'rental'
                  AND movement."MovementType" = 'rentalCheckout';
                """);
        }
    }
}
