using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addfavandshiper : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5a3f8f37-1604-48d4-99a4-2795ad7f408d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ef620e91-57ac-41ba-9d58-045a626fc550");

            migrationBuilder.AddColumn<string>(
                name: "APIUserId",
                table: "Products",
                type: "nvarchar(450)",
                nullable: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Products_APIUserId",
                table: "Products",
                column: "APIUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_AspNetUsers_APIUserId",
                table: "Products",
                column: "APIUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_AspNetUsers_APIUserId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_APIUserId",
                table: "Products");

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

            migrationBuilder.DropColumn(
                name: "APIUserId",
                table: "Products");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "ef620e91-57ac-41ba-9d58-045a626fc550", "ef0fdda2-a5c3-4251-8a66-29119863e789", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "5a3f8f37-1604-48d4-99a4-2795ad7f408d", "8390c45f-9f64-4a1e-af01-c2fa5b48a36a", "Administrator", "ADMINISTRATOR" });
        }
    }
}
