using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class promotion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1dea07a2-5724-452b-ae23-75cba48072a1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6f2a1a4c-a8c6-43ba-aef0-0bb0bf2aa0e1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e65571ea-628d-4885-be7d-67168f6f6140");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4dd100f-ebc5-4811-90eb-4177095847a8");

            migrationBuilder.AddColumn<string>(
                name: "PromotionAmount",
                table: "OrderDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PromotionPercent",
                table: "OrderDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "db5372d3-8b26-45bf-b62c-cfb86698e921", "7f83934b-550d-4383-bc00-296d25d2a20f", "User", "USER" },
                    { "36a77da3-4168-4f65-83d9-2d1587d82444", "f18d1a7d-7f1c-4dfa-87e2-bc7a0eea71e5", "Administrator", "ADMINISTRATOR" },
                    { "389dfa14-1969-4118-bb1b-1981dc39e412", "26f5fc4a-a916-4f7e-b724-99a0c5c3020a", "Employee", "EMPLOYEE" },
                    { "3f882e8f-623f-48ad-930b-516b3eba97d5", "f5cf3f22-5d7c-4689-b3c2-6c53e92726f7", "Shipper", "SHIPPER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "36a77da3-4168-4f65-83d9-2d1587d82444");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "389dfa14-1969-4118-bb1b-1981dc39e412");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3f882e8f-623f-48ad-930b-516b3eba97d5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "db5372d3-8b26-45bf-b62c-cfb86698e921");

            migrationBuilder.DropColumn(
                name: "PromotionAmount",
                table: "OrderDetails");

            migrationBuilder.DropColumn(
                name: "PromotionPercent",
                table: "OrderDetails");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6f2a1a4c-a8c6-43ba-aef0-0bb0bf2aa0e1", "e91599ab-9374-41fd-9348-76c14487c92d", "User", "USER" },
                    { "1dea07a2-5724-452b-ae23-75cba48072a1", "5816f10e-d92d-4aee-90b6-67af17180020", "Administrator", "ADMINISTRATOR" },
                    { "f4dd100f-ebc5-4811-90eb-4177095847a8", "0d0f2ee3-08da-47fa-8d1c-72956fb915ce", "Employee", "EMPLOYEE" },
                    { "e65571ea-628d-4885-be7d-67168f6f6140", "66bdecac-5797-4524-851c-82966f050036", "Shipper", "SHIPPER" }
                });
        }
    }
}
