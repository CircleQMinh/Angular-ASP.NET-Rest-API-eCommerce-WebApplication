using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addfavandshiper5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "252b0267-0c79-483b-9ae5-a246109ce681");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7576c53c-1f98-4730-9f92-a2acc8905875");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a274263e-4ba3-489b-a069-f1d9aa737ca1");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "43862d92-b8b6-4916-a7f4-11de0de2c33e", "7a5b157b-f108-4cc6-ae9d-e3c27afdc908", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "e142c3ad-0050-4b07-8dab-0ece68ca44ab", "d770025b-b5b2-4f0a-9361-22040b5d822f", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "f2ca778a-f504-4641-aabe-f303849e458e", "a5c9d9ee-d4aa-4b2d-9bc2-c6916c6bd984", "Shipper", "SHIPPER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "43862d92-b8b6-4916-a7f4-11de0de2c33e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e142c3ad-0050-4b07-8dab-0ece68ca44ab");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f2ca778a-f504-4641-aabe-f303849e458e");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a274263e-4ba3-489b-a069-f1d9aa737ca1", "21e5f4f9-45e9-44f0-979c-790dbff1ca3e", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "252b0267-0c79-483b-9ae5-a246109ce681", "b540a009-16f1-4230-8e49-36b1ed04bb7c", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "7576c53c-1f98-4730-9f92-a2acc8905875", "f46484fc-c05f-4722-aec7-8d5745657ccb", "Shipper", "SHIPPER" });
        }
    }
}
