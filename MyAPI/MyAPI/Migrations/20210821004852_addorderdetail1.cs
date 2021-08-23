using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addorderdetail1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9dc65d3c-a99b-4df7-b2e5-af3c24649f32");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a6ce0ed7-ffc1-4c4d-8c0e-714b22f636a8");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a863d955-e893-498c-82bb-54c9335893b5", "db475e1e-d3ac-465d-b8ff-59beb5632208", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "660cc3bd-231d-4f50-95a9-c67f213256ba", "cc3c6b4c-40cf-448a-9a4b-7ccc7522cd14", "Administrator", "ADMINISTRATOR" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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
                values: new object[] { "9dc65d3c-a99b-4df7-b2e5-af3c24649f32", "ad3bdacd-a3ff-4b23-b6aa-50715ff86245", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a6ce0ed7-ffc1-4c4d-8c0e-714b22f636a8", "bf468867-e7ac-428e-9faa-accdbd2696f9", "Administrator", "ADMINISTRATOR" });
        }
    }
}
