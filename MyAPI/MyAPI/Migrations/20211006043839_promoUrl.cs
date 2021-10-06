using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class promoUrl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5450b06a-f7ec-40ae-8a7e-50e81590f950");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8f168bd1-0f02-40ec-8dc2-675d33674528");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a6895037-9e2f-4810-9d07-474d230c2fa1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "afe111ef-cc52-45ad-9acd-51da1d8f9147");

            migrationBuilder.AddColumn<string>(
                name: "imgUrl",
                table: "Promotions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6ec06eec-41bf-4f44-ad15-5ae48f4fc851", "731f0336-87b3-41b4-b000-61933dfb5c30", "User", "USER" },
                    { "286894d7-290d-4ce9-b3dc-3b466c1e0ef3", "7cb5d57e-5f5b-4f61-993c-97766de65631", "Administrator", "ADMINISTRATOR" },
                    { "735e6c81-72dc-4fbc-8566-5cc3582f2695", "95631f4b-4437-44e1-9fce-f18def2256fd", "Employee", "EMPLOYEE" },
                    { "0baaacc3-48c5-4cde-97aa-43375f5ba323", "829d038a-df90-4499-b501-4c37c2cb91f6", "Shipper", "SHIPPER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0baaacc3-48c5-4cde-97aa-43375f5ba323");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "286894d7-290d-4ce9-b3dc-3b466c1e0ef3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6ec06eec-41bf-4f44-ad15-5ae48f4fc851");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "735e6c81-72dc-4fbc-8566-5cc3582f2695");

            migrationBuilder.DropColumn(
                name: "imgUrl",
                table: "Promotions");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "afe111ef-cc52-45ad-9acd-51da1d8f9147", "ab3f0c93-90db-48bf-8096-174721970ee3", "User", "USER" },
                    { "5450b06a-f7ec-40ae-8a7e-50e81590f950", "601a0b53-3817-47a0-81d7-1db76876d734", "Administrator", "ADMINISTRATOR" },
                    { "8f168bd1-0f02-40ec-8dc2-675d33674528", "9d325b5a-b975-442c-856b-b69f69f0d31f", "Employee", "EMPLOYEE" },
                    { "a6895037-9e2f-4810-9d07-474d230c2fa1", "492c4dc9-cf95-47cf-ab78-6b51552e7b5a", "Shipper", "SHIPPER" }
                });
        }
    }
}
