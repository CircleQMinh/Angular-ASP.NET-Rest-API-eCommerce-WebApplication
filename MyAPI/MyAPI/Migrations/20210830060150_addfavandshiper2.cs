using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addfavandshiper2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "20a49278-d68e-4eb5-9724-9aaea5f7ac98");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6911219f-e973-4217-bd1a-1c4bb598dbf1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9de2b08c-7875-4438-b336-76c3f436db05");

            migrationBuilder.CreateTable(
                name: "ShippingInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ShipperID = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShippingInfos_AspNetUsers_ShipperID",
                        column: x => x.ShipperID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ShippingInfos_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a6775f03-7b1c-4d59-939f-325c27072074", "2e7dc75b-2979-4069-b282-06895951507b", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b65bb868-993f-464e-89a0-93096da299b9", "af3e2943-fe37-4143-886c-613de5fe4de0", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "8fc3dc5d-4afb-4ac8-9e1f-4e6f1f999b27", "d50dc936-77b4-46f5-a534-11c13e7e5c7e", "Shipper", "SHIPPER" });

            migrationBuilder.CreateIndex(
                name: "IX_ShippingInfos_OrderId",
                table: "ShippingInfos",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingInfos_ShipperID",
                table: "ShippingInfos",
                column: "ShipperID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShippingInfos");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8fc3dc5d-4afb-4ac8-9e1f-4e6f1f999b27");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a6775f03-7b1c-4d59-939f-325c27072074");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b65bb868-993f-464e-89a0-93096da299b9");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "9de2b08c-7875-4438-b336-76c3f436db05", "5d1e3e23-61fc-4de4-a83e-5fb4aa88201c", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "20a49278-d68e-4eb5-9724-9aaea5f7ac98", "54a20cc7-c6a4-4d1c-8a40-4f29eda82488", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "6911219f-e973-4217-bd1a-1c4bb598dbf1", "02121edc-8c8d-478b-8a47-ee65e11da076", "Shipper", "SHIPPER" });
        }
    }
}
