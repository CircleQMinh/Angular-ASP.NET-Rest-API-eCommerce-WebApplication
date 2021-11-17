using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class final02 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiscountCodes_Orders_OrderId",
                table: "DiscountCodes");

            migrationBuilder.DropIndex(
                name: "IX_DiscountCodes_OrderId",
                table: "DiscountCodes");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "025b57e3-f0f2-426e-a15f-893b34b60123");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "08423e9b-c566-4ac0-b644-3116b5328c30");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "20cdb8c8-0321-42c1-b4a7-0d3c8b8502bd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "76798ffe-c5c6-4e7f-91ea-ffcb86d319f2");

            migrationBuilder.AlterColumn<int>(
                name: "OrderId",
                table: "DiscountCodes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "411a0993-9ce4-4027-9d3a-7fbe10bb3c95", "20dfdc14-ba10-40af-b2ca-0ed2a131ac18", "User", "USER" },
                    { "73316754-b454-480c-be66-2b06dc0e0522", "b87f2a4f-e105-426f-ad4c-b2ce808667d6", "Administrator", "ADMINISTRATOR" },
                    { "a671cb66-ab05-46cc-85e1-ec0a309efa34", "c2b3a50e-ba59-41f1-9e31-ec585e1ddd00", "Employee", "EMPLOYEE" },
                    { "64ef4495-6e73-48fe-be16-8c2b7d51eca1", "16518563-2fd3-4ac0-9f8b-271de2c422e7", "Shipper", "SHIPPER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCodes_OrderId",
                table: "DiscountCodes",
                column: "OrderId",
                unique: true,
                filter: "[OrderId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountCodes_Orders_OrderId",
                table: "DiscountCodes",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiscountCodes_Orders_OrderId",
                table: "DiscountCodes");

            migrationBuilder.DropIndex(
                name: "IX_DiscountCodes_OrderId",
                table: "DiscountCodes");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "411a0993-9ce4-4027-9d3a-7fbe10bb3c95");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "64ef4495-6e73-48fe-be16-8c2b7d51eca1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "73316754-b454-480c-be66-2b06dc0e0522");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a671cb66-ab05-46cc-85e1-ec0a309efa34");

            migrationBuilder.AlterColumn<int>(
                name: "OrderId",
                table: "DiscountCodes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "08423e9b-c566-4ac0-b644-3116b5328c30", "a6f7b667-8826-4146-b2a1-c9752ba08fae", "User", "USER" },
                    { "025b57e3-f0f2-426e-a15f-893b34b60123", "fcdc5a6c-3ec8-450b-9340-4bed7ab980cf", "Administrator", "ADMINISTRATOR" },
                    { "76798ffe-c5c6-4e7f-91ea-ffcb86d319f2", "fc6f912c-4e0b-4b9c-84e7-1b4e2c79e83a", "Employee", "EMPLOYEE" },
                    { "20cdb8c8-0321-42c1-b4a7-0d3c8b8502bd", "70967610-723d-4797-a057-4358ef60272a", "Shipper", "SHIPPER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCodes_OrderId",
                table: "DiscountCodes",
                column: "OrderId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountCodes_Orders_OrderId",
                table: "DiscountCodes",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
