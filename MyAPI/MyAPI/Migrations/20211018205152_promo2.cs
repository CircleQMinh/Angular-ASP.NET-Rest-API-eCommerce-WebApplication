using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class promo2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "Visible",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "64be40e1-cae5-4c13-9498-8a6c3be4684a", "db458108-d609-44b9-8f13-3b06ee742c2e", "User", "USER" },
                    { "cedd4323-0ad6-4a66-b48f-6c27e086c45a", "2e19f458-6d3a-400b-bd34-1a551cdf8b46", "Administrator", "ADMINISTRATOR" },
                    { "fdbb9bd1-b65c-4e2a-a82f-d4201d23d59c", "97097e97-236e-4921-bd83-adb7d00f9abd", "Employee", "EMPLOYEE" },
                    { "91ae0998-68f5-4a87-aaec-c939ffe22f63", "395000fa-f9f7-413a-9619-042a5e229e51", "Shipper", "SHIPPER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "64be40e1-cae5-4c13-9498-8a6c3be4684a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "91ae0998-68f5-4a87-aaec-c939ffe22f63");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cedd4323-0ad6-4a66-b48f-6c27e086c45a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fdbb9bd1-b65c-4e2a-a82f-d4201d23d59c");

            migrationBuilder.DropColumn(
                name: "Visible",
                table: "Promotions");

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
    }
}
