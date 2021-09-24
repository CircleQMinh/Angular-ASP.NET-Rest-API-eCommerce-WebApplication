using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addNV : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "EmployeeInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    imgUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sex = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Salary = table.Column<int>(type: "int", nullable: false),
                    CMND = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmployeeInfos_AspNetUsers_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeInfos_EmployeeID",
                table: "EmployeeInfos",
                column: "EmployeeID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmployeeInfos");

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
    }
}
