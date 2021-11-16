using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class final01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiscountCode_Orders_OrderId",
                table: "DiscountCode");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DiscountCode",
                table: "DiscountCode");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63d29051-7ea2-4088-bea0-8cb528b904d4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "903829f4-58e7-4f7e-932f-ebfa24829990");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9055b503-6484-4208-88c7-32600cae3421");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9c663511-bb66-4269-a2b2-dbd4c9b91623");

            migrationBuilder.RenameTable(
                name: "DiscountCode",
                newName: "DiscountCodes");

            migrationBuilder.RenameIndex(
                name: "IX_DiscountCode_OrderId",
                table: "DiscountCodes",
                newName: "IX_DiscountCodes_OrderId");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "DiscountCodes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DiscountCodes",
                table: "DiscountCodes",
                column: "Id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountCodes_Orders_OrderId",
                table: "DiscountCodes",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiscountCodes_Orders_OrderId",
                table: "DiscountCodes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DiscountCodes",
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

            migrationBuilder.DropColumn(
                name: "Code",
                table: "DiscountCodes");

            migrationBuilder.RenameTable(
                name: "DiscountCodes",
                newName: "DiscountCode");

            migrationBuilder.RenameIndex(
                name: "IX_DiscountCodes_OrderId",
                table: "DiscountCode",
                newName: "IX_DiscountCode_OrderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DiscountCode",
                table: "DiscountCode",
                column: "Id");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "9055b503-6484-4208-88c7-32600cae3421", "be9ca37a-1247-4b8f-bdbc-823d31146024", "User", "USER" },
                    { "63d29051-7ea2-4088-bea0-8cb528b904d4", "a244ab71-0bf2-4a6e-80a9-c675a7c41680", "Administrator", "ADMINISTRATOR" },
                    { "9c663511-bb66-4269-a2b2-dbd4c9b91623", "af6235ae-4de9-4bbc-a8fb-9e30b8910c8c", "Employee", "EMPLOYEE" },
                    { "903829f4-58e7-4f7e-932f-ebfa24829990", "a154266f-66b3-4c5a-ad27-e35bab69ecd6", "Shipper", "SHIPPER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountCode_Orders_OrderId",
                table: "DiscountCode",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
