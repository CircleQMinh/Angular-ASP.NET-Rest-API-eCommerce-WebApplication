using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addorderdetail2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "660cc3bd-231d-4f50-95a9-c67f213256ba");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a863d955-e893-498c-82bb-54c9335893b5");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "0e964e8b-e72a-40c3-ad54-eb4fa3b6fbdb", "80fbba54-f589-431a-8ced-2f0a3f955e9e", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "5a057acc-0aec-42f3-9563-23c3cc246673", "aaef393a-8bfd-4e10-a9b8-4eb2beab5b7f", "Administrator", "ADMINISTRATOR" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0e964e8b-e72a-40c3-ad54-eb4fa3b6fbdb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5a057acc-0aec-42f3-9563-23c3cc246673");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a863d955-e893-498c-82bb-54c9335893b5", "db475e1e-d3ac-465d-b8ff-59beb5632208", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "660cc3bd-231d-4f50-95a9-c67f213256ba", "cc3c6b4c-40cf-448a-9a4b-7ccc7522cd14", "Administrator", "ADMINISTRATOR" });
        }
    }
}
