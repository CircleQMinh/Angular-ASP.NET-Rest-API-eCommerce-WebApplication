using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addNV2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "048b6848-51f0-402a-8469-07d11755199b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2f5cad26-7b07-48b3-810d-5631355f31c6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d825adb8-960e-4ea6-8f45-b5f07a830069");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f270c9b5-e807-4b07-bd73-ccd789160e07");

            migrationBuilder.DropColumn(
                name: "imgUrl",
                table: "EmployeeInfos");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6f2a1a4c-a8c6-43ba-aef0-0bb0bf2aa0e1", "e91599ab-9374-41fd-9348-76c14487c92d", "User", "USER" },
                    { "1dea07a2-5724-452b-ae23-75cba48072a1", "5816f10e-d92d-4aee-90b6-67af17180020", "Administrator", "ADMINISTRATOR" },
                    { "f4dd100f-ebc5-4811-90eb-4177095847a8", "0d0f2ee3-08da-47fa-8d1c-72956fb915ce", "Employee", "EMPLOYEE" },
                    { "e65571ea-628d-4885-be7d-67168f6f6140", "66bdecac-5797-4524-851c-82966f050036", "Shipper", "SHIPPER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1dea07a2-5724-452b-ae23-75cba48072a1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6f2a1a4c-a8c6-43ba-aef0-0bb0bf2aa0e1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e65571ea-628d-4885-be7d-67168f6f6140");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f4dd100f-ebc5-4811-90eb-4177095847a8");

            migrationBuilder.AddColumn<string>(
                name: "imgUrl",
                table: "EmployeeInfos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "048b6848-51f0-402a-8469-07d11755199b", "5c843edc-ef80-4378-b3b8-87f31ffe86c7", "User", "USER" },
                    { "2f5cad26-7b07-48b3-810d-5631355f31c6", "a1167276-5269-4289-8ab4-ee472cf9a2be", "Administrator", "ADMINISTRATOR" },
                    { "f270c9b5-e807-4b07-bd73-ccd789160e07", "1770d79d-9b64-4414-9177-0bed344edcd6", "Employee", "EMPLOYEE" },
                    { "d825adb8-960e-4ea6-8f45-b5f07a830069", "f90ec82a-dd6d-4c6c-bbc0-fb4377fca38e", "Shipper", "SHIPPER" }
                });
        }
    }
}
