using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class addCate2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "411a0993-9ce4-4027-9d3a-7fbe10bb3c95");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "64ef4495-6e73-48fe-be16-8c2b7d51eca1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "73316754-b454-480c-be66-2b06dc0e0522");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a671cb66-ab05-46cc-85e1-ec0a309efa34");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "254e98e7-ec6f-4b75-81a8-3655ea6089de", "bf985721-1447-4ba1-abc4-4f7ad5a8fa5b", "User", "USER" },
                    { "3c7f1e45-20a0-4795-adad-ce383d2421f3", "a1e8efea-a417-4cc7-9f07-5f5c53c5f04f", "Administrator", "ADMINISTRATOR" },
                    { "9957d56b-01e7-47ee-8f7a-e2f63ee06d79", "b2ee7e88-4405-408c-8893-6d744bfdd2af", "Employee", "EMPLOYEE" },
                    { "f1353975-01cc-41b0-8a1b-ff348284a943", "69dd8bf8-56b4-4806-80e3-ab570ec011d6", "Shipper", "SHIPPER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Category_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Category_CategoryId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropIndex(
                name: "IX_Products_CategoryId",
                table: "Products");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "254e98e7-ec6f-4b75-81a8-3655ea6089de");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3c7f1e45-20a0-4795-adad-ce383d2421f3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9957d56b-01e7-47ee-8f7a-e2f63ee06d79");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f1353975-01cc-41b0-8a1b-ff348284a943");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Products");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "411a0993-9ce4-4027-9d3a-7fbe10bb3c95", "20dfdc14-ba10-40af-b2ca-0ed2a131ac18", "User", "USER" },
                    { "73316754-b454-480c-be66-2b06dc0e0522", "b87f2a4f-e105-426f-ad4c-b2ce808667d6", "Administrator", "ADMINISTRATOR" },
                    { "a671cb66-ab05-46cc-85e1-ec0a309efa34", "c2b3a50e-ba59-41f1-9e31-ec585e1ddd00", "Employee", "EMPLOYEE" },
                    { "64ef4495-6e73-48fe-be16-8c2b7d51eca1", "16518563-2fd3-4ac0-9f8b-271de2c422e7", "Shipper", "SHIPPER" }
                });
        }
    }
}
