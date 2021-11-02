using Microsoft.EntityFrameworkCore.Migrations;

namespace MyAPI.Migrations
{
    public partial class tag1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tags_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "898710e3-b2ec-49a6-890c-cd379fae62a8", "812d109d-3ff3-4533-ab15-3e2db6afabd3", "User", "USER" },
                    { "b894db69-2638-48eb-b5d4-ce4adeda8afa", "3e7c3347-c195-40b8-abfa-aecea2b51587", "Administrator", "ADMINISTRATOR" },
                    { "db08f21f-ba32-4660-b1a1-9dcd70526f98", "05409345-f9d4-4bc3-b432-3d53833aa50b", "Employee", "EMPLOYEE" },
                    { "3d057bac-440f-4aa7-b1e3-d4c8d6a26a93", "709d2b10-928d-4d1b-a0a9-bfd471fc16e1", "Shipper", "SHIPPER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tags_ProductId",
                table: "Tags",
                column: "ProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3d057bac-440f-4aa7-b1e3-d4c8d6a26a93");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "898710e3-b2ec-49a6-890c-cd379fae62a8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b894db69-2638-48eb-b5d4-ce4adeda8afa");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "db08f21f-ba32-4660-b1a1-9dcd70526f98");

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
    }
}
