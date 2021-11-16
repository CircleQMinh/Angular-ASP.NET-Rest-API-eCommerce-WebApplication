using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class final0 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3d057bac-440f-4aa7-b1e3-d4c8d6a26a93");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "898710e3-b2ec-49a6-890c-cd379fae62a8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b894db69-2638-48eb-b5d4-ce4adeda8afa");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "db08f21f-ba32-4660-b1a1-9dcd70526f98");

            migrationBuilder.AddColumn<int>(
                name: "ShippingFee",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Coins",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DiscountCode",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    DiscountPercent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiscountAmount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountCode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiscountCode_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCode_OrderId",
                table: "DiscountCode",
                column: "OrderId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiscountCode");

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

            migrationBuilder.DropColumn(
                name: "ShippingFee",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Coins",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "898710e3-b2ec-49a6-890c-cd379fae62a8", "812d109d-3ff3-4533-ab15-3e2db6afabd3", "User", "USER" },
                    { "b894db69-2638-48eb-b5d4-ce4adeda8afa", "3e7c3347-c195-40b8-abfa-aecea2b51587", "Administrator", "ADMINISTRATOR" },
                    { "db08f21f-ba32-4660-b1a1-9dcd70526f98", "05409345-f9d4-4bc3-b432-3d53833aa50b", "Employee", "EMPLOYEE" },
                    { "3d057bac-440f-4aa7-b1e3-d4c8d6a26a93", "709d2b10-928d-4d1b-a0a9-bfd471fc16e1", "Shipper", "SHIPPER" }
                });
        }
    }
}
