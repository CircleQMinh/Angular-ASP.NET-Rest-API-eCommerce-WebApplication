using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addorderdetail3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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
                values: new object[] { "2cfaee6a-c5c9-403a-a3c7-f11e6b7aa785", "e7a82313-ab7d-4237-a571-30bfb16da479", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "eae3ac01-8540-4420-8a62-d58b288c607f", "8dd5c1cc-9a65-47a9-9360-efe1ea9fba91", "Administrator", "ADMINISTRATOR" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2cfaee6a-c5c9-403a-a3c7-f11e6b7aa785");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "eae3ac01-8540-4420-8a62-d58b288c607f");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "0e964e8b-e72a-40c3-ad54-eb4fa3b6fbdb", "80fbba54-f589-431a-8ced-2f0a3f955e9e", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "5a057acc-0aec-42f3-9563-23c3cc246673", "aaef393a-8bfd-4e10-a9b8-4eb2beab5b7f", "Administrator", "ADMINISTRATOR" });
        }
    }
}
