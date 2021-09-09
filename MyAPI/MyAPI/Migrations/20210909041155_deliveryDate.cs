using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class deliveryDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "deliveryDate",
                table: "ShippingInfos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "3e648c0a-6de5-47e4-a0b3-157d203ed407", "01eb724d-bbba-45fd-8890-6ebe07859296", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "e3ea525d-8610-4704-b8a7-0fe69c1148c8", "c03a2c44-03c5-4ab3-a23c-ac00943be052", "Administrator", "ADMINISTRATOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "84f60f6e-9132-4dab-a887-4019e4c478a4", "9b9c1f23-867f-4100-bec7-9023d84de0a7", "Shipper", "SHIPPER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3e648c0a-6de5-47e4-a0b3-157d203ed407");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "84f60f6e-9132-4dab-a887-4019e4c478a4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e3ea525d-8610-4704-b8a7-0fe69c1148c8");

            migrationBuilder.DropColumn(
                name: "deliveryDate",
                table: "ShippingInfos");

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
    }
}
