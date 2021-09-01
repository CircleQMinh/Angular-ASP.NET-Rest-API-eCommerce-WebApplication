using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class dbreview3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "aa3245e0-23a3-4a30-bb3d-26deed8ba4be", "a0239872-d161-40e1-9709-a504f301fd12", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "61d7eb7b-321c-4695-b7fe-e6b2891fdb45", "6d13b1fa-5f11-437e-aa06-9c264a07a157", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "2e1a1973-a03a-402f-8a1f-f2329a28d329", "b05d9b6e-756f-480a-88f1-faffe7436103", "Shipper", "SHIPPER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2e1a1973-a03a-402f-8a1f-f2329a28d329");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "61d7eb7b-321c-4695-b7fe-e6b2891fdb45");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "aa3245e0-23a3-4a30-bb3d-26deed8ba4be");
        }
    }
}
