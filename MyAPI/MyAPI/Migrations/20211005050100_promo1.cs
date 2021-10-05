using Microsoft.EntityFrameworkCore.Migrations;



namespace MyAPI.Migrations
{
    public partial class promo1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7a481140-5bfc-4740-8ce3-d58696d41c5b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c3b12aee-97d8-4d24-bd78-d75f92af509a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e56937cc-21e5-4345-9661-7f0443c5e131");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4f7eca9-2644-4ea6-9428-4fdcf4a62a91");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Products");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7a481140-5bfc-4740-8ce3-d58696d41c5b", "c2fbd559-b118-404c-822a-cadee2b005f3", "User", "USER" },
                    { "c3b12aee-97d8-4d24-bd78-d75f92af509a", "c1f098b0-7342-4693-8586-ad09f4453e15", "Administrator", "ADMINISTRATOR" },
                    { "f4f7eca9-2644-4ea6-9428-4fdcf4a62a91", "de89a5b3-c9bf-49b5-97c4-e2db429285dd", "Employee", "EMPLOYEE" },
                    { "e56937cc-21e5-4345-9661-7f0443c5e131", "36b47132-d78c-47f7-93dc-9ed14ff90a9e", "Shipper", "SHIPPER" }
                });
        }
    }
}
