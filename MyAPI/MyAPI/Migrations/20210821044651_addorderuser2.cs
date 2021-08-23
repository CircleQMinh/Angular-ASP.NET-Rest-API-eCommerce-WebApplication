using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addorderuser2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "75150d98-8ba5-4d5f-833d-3722d262e473");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a097499e-3d6f-478b-8a0f-2347d94a649e");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "ef620e91-57ac-41ba-9d58-045a626fc550", "ef0fdda2-a5c3-4251-8a66-29119863e789", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "5a3f8f37-1604-48d4-99a4-2795ad7f408d", "8390c45f-9f64-4a1e-af01-c2fa5b48a36a", "Administrator", "ADMINISTRATOR" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5a3f8f37-1604-48d4-99a4-2795ad7f408d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ef620e91-57ac-41ba-9d58-045a626fc550");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Orders");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "75150d98-8ba5-4d5f-833d-3722d262e473", "fecb81f0-709c-4c0a-add8-14b5fd19edcf", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a097499e-3d6f-478b-8a0f-2347d94a649e", "59e83050-e518-4153-b040-d90b7a5472fa", "Administrator", "ADMINISTRATOR" });
        }
    }
}
